"use client";

// The AI drafting a reply in real time: the email types itself out when the card
// scrolls into view, then follow-up prompt chips appear - click one and the AI
// redrafts with that instruction, live. Mirrors what the real product does when
// you hand a draft back with extra context. Reduced motion shows finished text.

import { useEffect, useRef, useState } from "react";

const DRAFTS: Record<string, string> = {
  base: "Hi Sarah - great question. Most people split Momentum into four monthly payments of $1,200; the card charges itself on schedule so there's nothing to remember. Want me to hold Thursday 2pm so we can walk through it?",
  casual:
    "Hey Sarah! Good news - you can split Momentum into four monthly payments of $1,200, and the card takes care of itself each month. Nothing to remember. Free Thursday at 2? I'll hold it for you.",
  wednesday:
    "Hi Sarah - great question. Most people split Momentum into four monthly payments of $1,200; the card charges itself on schedule so there's nothing to remember. Want me to hold Wednesday 2pm so we can walk through it?",
};

const FOLLOW_UPS = [
  { key: "casual", label: "Make it more casual" },
  { key: "wednesday", label: "Move the call to Wednesday" },
] as const;

export default function AIDraftCard() {
  const [variant, setVariant] = useState<keyof typeof DRAFTS>("base");
  const [n, setN] = useState(0); // characters revealed
  const [started, setStarted] = useState(false);
  const [reduce, setReduce] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const draft = DRAFTS[variant];
  const done = n >= draft.length;
  // follow-ups redraft noticeably faster - the AI already has the thread
  const speed = variant === "base" ? 1 : 0.45;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = requestAnimationFrame(() => {
        setReduce(true);
        setN(DRAFTS.base.length);
      });
      return () => cancelAnimationFrame(r);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || done || reduce) return;
    // human-ish rhythm: quick keystrokes, brief hangs after punctuation
    const ch = draft[n - 1];
    const pause =
      (ch === "." || ch === "?" ? 260 : ch === "," || ch === ";" ? 130 : ch === " " ? 24 : 16) *
      speed;
    const t = setTimeout(() => setN((v) => v + 1), pause);
    return () => clearTimeout(t);
  }, [started, n, done, draft, speed, reduce]);

  const followUp = (key: keyof typeof DRAFTS) => {
    if (!done) return;
    setVariant(key);
    setN(reduce ? DRAFTS[key].length : 0);
  };

  return (
    <div className="aidraft" ref={ref} aria-label="An email reply being drafted by the AI">
      <header>
        <div>
          <strong>Re: Payment plan options?</strong>
          <em>Sarah Mitchell · 12 min ago</em>
        </div>
        <span className={`ai-chip${done ? "" : " writing"}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
          </svg>
          {done ? "Draft ready" : variant === "base" ? "Drafting…" : "Redrafting…"}
        </span>
      </header>
      <p aria-live="off">
        {draft.slice(0, n)}
        {!done && <span className="ai-caret" aria-hidden="true" />}
      </p>
      <footer className={done ? "shown" : ""}>
        <span className="pu-btn approve">Approve &amp; send</span>
        <em>Drafted in Marcus&apos;s voice · or tell it what to change:</em>
      </footer>
      <div className={`ai-follow${done ? " shown" : ""}`} aria-label="Follow-up instructions">
        {FOLLOW_UPS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={variant === f.key ? "on" : ""}
            disabled={!done}
            onClick={() => followUp(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
