# Wayfinder OS site redesign — plan v3 (2026-07-21, post-Codex review)

Two governing themes: **interactive** and **premium**. Show, don't tell. Emotions, not features. Premium = restraint and truth, not more effects.
Constraint: keep the solar-system space theme (canvas orbit → collapse → hyperspace warp). Everything else may be redone.

## 1. Brand / logo (match wayfindercollective.io)

- Reference: icon (dark rounded square + arrow) beside wordmark — `Wayfinder` near-white, `OS` **cyan**. Their dark-theme primary-text token = `#22d3ee` (cyan-400), identical to our `--accent`.
- Change: `.brand .os` from muted gray → `--accent` cyan everywhere the wordmark appears (nav, footer, waitlist page). Icon mark already renders in nav/footer; align its treatment with the reference (rounded-square container).
- No other palette change — the site already runs zinc-950 + cyan-400.

## 2. Waitlist form — functional match to wayfindercollective.io/waitlist

Canonical **`/waitlist` route** (same URL shape as the reference). Every CTA links there; the old modal and `.apply-open` DOM-listener pattern are removed. One controlled `WaitlistStepper` component.

Steps (extracted from their production bundle — replicated exactly, including which are required):

| # | id | question | type | required |
|---|----|----------|------|----------|
| 1 | fullName | What's your name? | text ("John Smith") | yes |
| 2 | email | What's your email? | email ("john@company.com"), regex | yes |
| 3 | phone | Best number to reach you? | tel, auto-format (xxx) xxx-xxxx, ≥10 digits, submits digits | yes |
| 4 | businessName | What's your business called? | text ("Your Company") | yes |
| 5 | currentSoftware | What software do you use now? | select: GoHighLevel / Close CRM / HubSpot–Pipedrive / Spreadsheets + Stripe / Multiple disconnected tools / Something else | advance-by-click |
| 6 | monthlySpend | Monthly software spend? | select: $0-300 → $20k+/mo (7 tiers) | advance-by-click |
| 7 | biggestFrustration | Biggest frustration? | textarea ("What's driving you crazy...") | no |
| 8 | desiredFeature | What would help most? | textarea ("If we could fix one thing...") | no |

Behavior: progress bar + percent, Back (hidden on step 1, answers preserved), Next → Submit ("Submitting…" spinner), selects auto-advance ~200ms after click, "Press **Enter** to continue" hint on text steps, per-step autofocus, inline errors ("This field is required" / "Please enter a valid email"), UTM capture from query string, double-submit guard.
Accessibility/robustness beyond the reference: labelled errors with `aria-live` status, mobile-keyboard `inputMode`s, paste-tolerant phone formatting, disabled state while submitting.
Friction softeners: "Takes about 2 minutes" note near the start; a line on why we ask for a number.
Success: check-circle, **"You're on the list"** + reference copy — confirmation shows immediately; a short celebration (starfield flourish) may play behind it but never gates the confirmation. Warp is decoupled from the form (explicit prop/callback, not the global `wf:warp` event) and only used where a `SpaceScene` exists.

Submission: `POST /api/waitlist` with the reference payload shape (`fullName, email, phone, businessName, currentSoftware, monthlySpend, biggestFrustration, desiredFeature, utm_*, source`). Server-side destination = **user decision** (see open questions). Route must fail safely: if no destination is configured in production, return an error state — never silently swallow leads. Basic honeypot field + timeout on the upstream call. Keep `/api/apply` as a temporary alias.

## 3. Product showcase — one truthful, polished workflow (per review, scaled down from full replica)

No real captures exist in the repo and the admin is behind a login. Approach (pending user's answer on real assets):

- **One authored workflow demo**, not a seven-module fake product: *lead comes in → booked call → payment collected → commission calculated → dashboard updates.* Rendered as a real-looking Wayfinder OS app shell (sidebar, top bar, zinc/cyan product tokens) with a content panel that walks the workflow.
- **Interactive**: viewer can click through the workflow stages (stepper dots / sidebar items scoped to the stages); an **auto-play tour** with a simulated cursor runs when scrolled into view and yields instantly to the user's own pointer. Satisfies "clickable, or at least a video of a mouse clicking around" without video assets.
- Data shown is illustrative and coherent (one consistent fictional company end-to-end) — no glowing fake-metric wallpaper. If the user supplies real screenshots/recordings, they slot into the same frame and the coded demo becomes the fallback/hover states.
- Engineering: mounts on IntersectionObserver, transform/opacity animation only, `prefers-reduced-motion` → static composed state, zero new dependencies.

## 4. Page arc — product earlier, emotions specific (per review)

Keep canvas anchors `#problem`, `#collapse` in order; compress the front of the page so proof arrives by ~screen 2–3. Arc: *specific promise → proof → emotional outcomes → credibility → reassurance → invitation.*

1. **Hero** (centered): category + audience + outcome, then feeling. Direction: "The operating system for coaching companies." headline energy with specific emotional sub-copy (the Sunday-night reconciliation, the commission number nobody can explain, the seventh login before lunch). CTA **"Apply to try it free"** + badge **"Founders Pass — 10 spots left"**. A glimpse of the product visible at/near the fold.
2. **Problem** (`#problem`, tightened to one beat): money leaking between tools, reports you can't trust, new hires lost in seven systems.
3. **The fix** (`#collapse`): orbit collapses into the core (existing animation, kept tight).
4. **Workflow demo** (§3): "Watch a lead become revenue — then click around yourself."
5. **Relief outcomes** (restrained, 4 beats max, each tied to something visible in the demo): *No more spreadsheets* (commissions calculate themselves) · *Numbers you can trust in real time* · *No more chasing money* (auto-charge, failed-payment alerts) · *One login, not a hundred*. No "zero training" over-claim — "simple enough that your team just starts using it" territory, kept honest.
6. **Credibility**: founder/operator story with real name + photo if supplied; verifiable specifics (built to run their own coaching company) instead of manufactured proof. Placeholder testimonials **removed** until real quotes exist.
7. **Migration reassurance**: "We map your stack. We run side by side. You switch when you're ready."
8. **Founders Pass**: "Apply to try it for free." 10 spots, single `SPOTS_LEFT` const, perks: founding pricing, direct line to shape the product.
9. **FAQ** (pruned to objection-shaped questions) + footer.

## 5. Screen-size & readability pass

- **Centering**: hero content centered at every size; canvas gets per-breakpoint layout geometry (orb offset, orbit radius, text-exclusion zone) so orbits/labels never cross copy; parallax damped or disabled where it threatens text; subtle radial scrim behind hero text.
- **Choreography resilience**: remeasure anchors via `ResizeObserver` + `document.fonts.ready`, not just resize + one 400ms timer.
- Audit 360 / 390 / 768 / 1024 / 1280 / 1440 / 1920+ and short viewports; fix overlap, dead-center voids, clipped CTAs. Verify with real browser screenshots.
- **Mobile nav**: proper menu (links currently vanish <960px with no fallback).
- Type: `clamp()` audit, ≥16px body, AA contrast over canvas.

## 6. Engineering notes

- Next.js **16.2.9** breaking changes — consult `node_modules/next/dist/docs/` before route/API/layout work.
- No new dependencies. Accent cyan defined in both `globals.css` and `SpaceScene.tsx` constants — keep synced.
- Preserve recent perf work (no shadowBlur, low canvas fill-rate) and reduced-motion paths.
- `/waitlist` page: no full SpaceScene dependency; it gets its own lightweight backdrop so the form never breaks if the scene is absent.

## Open questions → asked 2026-07-21

1. Lead destination (forward to wayfindercollective.io API vs webhook vs both).
2. Real product captures available, or coded workflow demo?
3. Founder name/photo + any verifiable specifics for the credibility section?
