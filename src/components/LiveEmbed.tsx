"use client";

// Live product embed. Wraps a coded placeholder and, when an embed origin is
// configured, silently upgrades it to a real iframe of the OS - no "try it live"
// button, no spinner: the iframe starts loading a screen or two before the
// visitor reaches it, then cross-fades in over the identical-looking placeholder.
// By the time they scroll to it, they're clicking the real product.
//
// The swap happens ONLY on an explicit postMessage handshake from the embed -
// never on the iframe `load` event, which also fires for 404s, 500s, auth
// redirects and some CSP failures, and would otherwise present an error page to
// the visitor labelled "the real product". No handshake => the coded
// placeholder simply stays. See docs/LIVE_EMBED.md for the contract.

import { useEffect, useRef, useState } from "react";

const RAW_ORIGIN = process.env.NEXT_PUBLIC_OS_EMBED_ORIGIN ?? "";
const MIN_WIDTH = 1024; // real app chrome doesn't reflow below this
const READY_TIMEOUT = 12000;
const READY_TYPE = "wayfinder-embed-ready";
const READY_VERSION = 1;

// Only ever frame an https origin that isn't this page's own origin: with
// `allow-same-origin` a same-origin frame could reach into the parent document.
function resolveOrigin(): string | null {
  if (!RAW_ORIGIN) return null;
  try {
    const u = new URL(RAW_ORIGIN);
    if (u.protocol !== "https:") return null;
    if (typeof window !== "undefined" && u.origin === window.location.origin) return null;
    return u.origin;
  } catch {
    return null;
  }
}

export default function LiveEmbed({
  path,
  title,
  allow,
  liveHeight,
  children,
}: {
  path: string; // e.g. "/embed/sandbox/composer"
  title: string; // accessible name for the frame
  // Permissions delegated INTO the frame. Only the video room needs this:
  // getUserMedia rejects silently inside an iframe without an explicit
  // allow-list, so the camera demo would look broken rather than blocked.
  // Everything else stays on the default (no delegated permissions).
  allow?: string;
  // Height the wrapper grows to once the REAL product is showing. The coded
  // placeholders are deliberately compact; the actual app needs more room (a
  // pipeline board or a video room squeezed into placeholder height gets
  // clipped). Only applied when live, so the pre-reveal layout is unchanged.
  liveHeight?: number;
  children: React.ReactNode; // the coded placeholder
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [dead, setDead] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Arm the load well before the section is on screen, so it's interactive on
  // arrival. Nothing loads on initial paint. Re-evaluated on resize so a window
  // dragged past the width threshold behaves correctly in both directions.
  useEffect(() => {
    const origin = resolveOrigin();
    if (!origin) return;
    const el = ref.current;
    if (!el) return;

    let io: IntersectionObserver | null = null;
    const arm = () => {
      if (io || window.innerWidth < MIN_WIDTH) return;
      io = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting)) {
            setSrc(`${origin}${path}`);
            io?.disconnect();
            io = null;
          }
        },
        { rootMargin: "1400px 0px" }
      );
      io.observe(el);
    };

    const onResize = () => {
      if (window.innerWidth < MIN_WIDTH) {
        // dropped below the threshold - tear the frame back down
        io?.disconnect();
        io = null;
        setSrc(null);
        setReady(false);
      } else {
        arm();
      }
    };

    arm();
    window.addEventListener("resize", onResize);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [path]);

  // The handshake: only a message from the expected origin AND from this
  // frame's own window counts.
  useEffect(() => {
    if (!src || ready || dead) return;
    const origin = resolveOrigin();
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== origin) return;
      if (e.source !== frameRef.current?.contentWindow) return;
      const d = e.data as { type?: string; version?: number } | null;
      if (d?.type === READY_TYPE && d.version === READY_VERSION) setReady(true);
    };
    window.addEventListener("message", onMsg);
    const t = setTimeout(() => setDead(true), READY_TIMEOUT);
    return () => {
      window.removeEventListener("message", onMsg);
      clearTimeout(t);
    };
  }, [src, ready, dead]);

  const live = Boolean(src) && ready && !dead;

  // When the live frame takes over, the placeholder must leave the tab order
  // too - `aria-hidden` alone still leaves its buttons focusable, stranding
  // keyboard users in controls they cannot see.
  return (
    <div
      className={`live-embed${live ? " live" : ""}`}
      ref={ref}
      style={live && liveHeight ? { minHeight: liveHeight } : undefined}
    >
      <div className="le-placeholder" inert={live || undefined}>
        {children}
      </div>
      {src && !dead && (
        <iframe
          ref={frameRef}
          className="le-frame"
          src={src}
          title={title}
          loading="eager"
          // Minimum viable capability set. `allow-same-origin` is required for
          // the embed's own session/storage; `allow-top-navigation` is
          // deliberately absent so nothing inside can steer this page. Add
          // further tokens only with a specific justification.
          sandbox="allow-scripts allow-same-origin"
          allow={allow}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
      {live && <span className="le-badge">Live · you&apos;re using the real product</span>}
    </div>
  );
}
