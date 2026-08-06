# Live OS embeds - the integration contract

**Architecture, security model and sequencing live in `PLAN.md` §3 and must not
be duplicated here** (an earlier version of this file drifted out of sync with
the plan and described a design that had already been rejected on security
grounds). This document is only the contract between the two codebases: what the
marketing site does, and what an embed route must implement to work with it.

Goal, for context: a visitor scrolling the marketing site reaches the AI-email or
pipeline section and starts clicking the real product inline - no button, no
signup, and nothing on screen they are not allowed to do.

---

## What the marketing site does

`src/components/LiveEmbed.tsx` wraps each coded placeholder.

- **Nothing loads on first paint.** An IntersectionObserver with a 1400px
  `rootMargin` sets the iframe `src` roughly two screens early, so the embed is
  loaded and interactive by the time the visitor arrives. This is why there is
  no "try it live" button.
- **The placeholder stays until an explicit readiness handshake** (below). The
  iframe `load` event is deliberately ignored - it also fires for 404s, 500s,
  auth redirects and some CSP failures, which would present an error page to the
  visitor labelled as the real product.
- While off-screen, the frame has `display: none`: it still loads and completes
  the readiness handshake, but has no rendered owner box that an inner autofocus
  call could drag into view. At 50% visibility it receives a box; until ready it
  also remains `visibility: hidden` and `pointer-events: none`. Once live, the
  placeholder becomes `inert` so it leaves the tab order. Non-composer embeds
  additionally wait for deliberate pointer or keyboard activity.
- The composer opts into `focusOnVisible`. Once its reveal finishes, the site
  calls `iframe.focus({ preventScroll: true })`; the composer treats window
  focus as the signal to focus its prompt with `preventScroll` too. Both sides
  are required to produce a blinking caret without dragging the parent page.
- **No handshake within 12s** => the frame is discarded and the coded
  placeholder simply remains. Same for any failure.
- **Below 1024px viewport width the iframe is never created** - real app UI does
  not reflow to a phone - and this is re-evaluated on resize in both directions.
- The configured origin is validated: it must be `https:` and must **not** be
  this page's own origin (with `allow-same-origin`, a same-origin frame could
  reach into the parent document).
- Sandbox is `allow-scripts allow-same-origin` only. `allow-top-navigation` is
  deliberately absent so nothing inside the frame can steer the marketing page.
  Any additional token needs a specific justification.

## What an embed route must implement

### 1. The readiness handshake (required - without it the embed never shows)

Once rendered and genuinely interactive, post exactly:

```js
parent.postMessage({ type: 'wayfinder-embed-ready', version: 1 }, EXPECTED_PARENT_ORIGIN)
```

Target a specific parent origin, never `'*'`. The site verifies `event.origin`
and that the message came from that frame's own `contentWindow` before revealing
it. Treat this as a health signal: do not post it if the module failed to load
its data, so a broken embed falls back to the placeholder instead of showing a
broken product.

### 2. Identity bootstrap

The iframe URL carries a **single-use, short-TTL, route-bound code**, exchanged
by the embed for a demo-only credential, with the code then removed from the URL.
See `PLAN.md` §3.1 - in particular, the embed must bind to a demo identity
unconditionally and must never derive tenancy from an ambient Clerk session, or a
signed-in customer would see their own production org inside a marketing page.

> **Not yet implemented on the site side.** `LiveEmbed` currently sets
> `src = origin + path` with no code parameter. Adding the bootstrap fetch is a
> Phase C task and is a gate for switch-on.

### 3. Presentation

Chromeless - no sidebar, top bar, account menu, or links that navigate anywhere.
Follow the existing `(standalone)` route-group pattern in the product. Match the
coded placeholders (`AIDraftCard.tsx`, `OSDemo.tsx`) closely enough that the
cross-fade is invisible. Send `no-store` and `noindex`.

### Routes

| Route | Visitor can |
|---|---|
| `/embed/ai-email` | Read the draft, send follow-up instructions, watch it redraft |
| `/embed/pipeline` | Drag deals between stages, open a deal, see payments/commissions/dashboard react |

## Configuration

| Where | Variable | Purpose |
|---|---|---|
| Marketing site | `NEXT_PUBLIC_OS_EMBED_ORIGIN` | Embed origin, e.g. `https://demo.wayfinderos.ai`. Blank => coded placeholders only. Compiled into client assets, so changing it needs a redeploy - it is **not** the kill switch. |
| Product | `EMBED_FRAME_ANCESTORS` | Comma-separated marketing origins allowed to frame `/embed/*`. Model on the existing `BOOKING_FRAME_ANCESTORS` handling in `next.config.js`. |

The authoritative kill switch is server-side in the product - see `PLAN.md` §3.5.

## Asset slots (unrelated to embeds, same drop-in pattern)

Files placed in `public/media/` are picked up at build time by `src/app/page.tsx`:

| File | Where | Spec |
|---|---|---|
| `coaching.mp4` (+ optional `coaching.jpg`) | "Where the coaching happens" | Autoplay, muted, looped b-roll. 16:9, 10-30s, H.264, under ~20MB. |
| `testimonial-1.mp4` (+ optional `testimonial-1.jpg`) | Proof section - only renders when present | With audio; gets real player controls. |
| `dashboard.png` | Platform section panel | Real dashboard screenshot, no browser chrome, ~1600px wide, dark theme. |
