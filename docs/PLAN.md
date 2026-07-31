# Wayfinder OS site - master plan (2026-07-22)

Supersedes `REDESIGN_PLAN.md` (which was the pre-build plan). Companion doc:
`LIVE_EMBED.md` (embed spec detail).

Two repos are involved:
- **`wayfinderos-ai`** (this one) - the marketing site. Next 16, React 19.
- **`Wayfinder OS/Wayfinder-OS`** - the product. Next 14, Clerk, Convex, Vercel.

---

## 1. Where the site is now

Built and verified (production build + lint + typecheck clean; Playwright passes
at 390/768/1280/1440/1920 with no page errors). **Uncommitted** on `main`.

Section order: hero → problem+fix (one narrative, `#problem`/`#collapse`) → demo
→ melt → platform → AI → coaching → [proof] → migration → apply → FAQ.

- **Hero centred**, canvas orbit sized from the measured `.hero-core` box so
  icons/labels ring around the copy and never cross it; labels glide smoothly
  around each icon (no flip); orbit hidden <760px.
- **Waitlist** `/waitlist` - 8-step stepper functionally matching
  wayfindercollective.io/waitlist. `POST /api/waitlist` forwards to the
  production waitlist API, honeypot, UTM capture, fails loudly in prod.
- **Interactive demo** (`OSDemo`) - coded 4-stage workflow, simulated cursor
  tour that yields to the real pointer, live upward-drifting revenue chart.
- **AI email** (`AIDraftCard`) - types itself on scroll, then accepts follow-up
  instructions ("make it casual", "move to Wednesday") and redrafts.
- **Melt section** - pains stay readable, then dissolve in sequence into reliefs.
- **`LiveEmbed`** - built, inert until `NEXT_PUBLIC_OS_EMBED_ORIGIN` is set.
- Coded vignettes stand in for all missing media; no empty placeholder frames.

### Outstanding on the site itself

| # | Item | Blocker? |
|---|---|---|
| 1.1 | Commit + deploy (nothing is committed yet) | yes |
| 1.2 | Real assets: `coaching.mp4`, `testimonial-1.mp4`, `dashboard.png` (see LIVE_EMBED/asset list) | no - degrades gracefully |
| 1.3 | End-to-end waitlist submission against the production API - **never yet tested with a real POST** | **yes - launch gate** |
| 1.8 | Privacy policy + terms pages and footer links - the site collects name/email/phone and has neither | **yes - launch gate** |
| 1.9 | Decide phone handling: `formatPhone` truncates to 10 digits (exact parity with the reference form) which corrupts UK/international numbers | yes if non-US traffic |
| 1.4 | OG/social image (currently none; `metadataBase` = wayfinderos.ai) | no |
| 1.5 | Confirm production domain (affects §3.1 decisively) | **yes** |
| 1.6 | Analytics/consent decision - none currently wired | no |
| 1.7 | `SPOTS_LEFT` is hardcoded 10 in `src/lib/waitlist.ts`; goes stale as seats fill | no |

## 2. Principles

- **Never regress the "not AI-made" work**: one outlined button style, emphasis
  by dimming not colour, no gradient text/glassmorphism, hyphens not em dashes.
- **Truthful demos.** Coded illustrations are labelled as illustrations. The
  live embed is labelled as the real product. Nothing fabricated is presented
  as evidence.
- **Fail soft.** Every enhancement degrades to something that works: embed →
  coded demo; missing media → coded vignette; JS off → static content.
- **Perf discipline holds**: no `backdrop-filter` over the animated canvas, no
  canvas `shadowBlur`, nebula blitted from a small offscreen buffer.

## 3. The live-embed programme

Goal: a visitor scrolling the marketing site reaches the AI-email or pipeline
section and **starts clicking the real product inline** - no button, no signup.
They can only do what is on screen.

The site-side **iframe wrapper** is done (`src/components/LiveEmbed.tsx`):
IntersectionObserver arms the iframe 1400px early so it is interactive on
arrival, reveals only on the `wayfinder-embed-ready` handshake, falls back on
timeout, never iframes below 1024px, sandbox without `allow-top-navigation`.
The site-side **identity bootstrap is not built** - see §3.1 and Phase C; it is a
switch-on blocker.

### 3.1 Hostname and identity (the hard part - not just cookies)

**Middleware routing comes first.** `Wayfinder-OS/src/middleware.ts` treats only
`admin.*` as the app host; other hosts are handled as the sites platform or
redirected to `admin.*`, and `/embed` is not a public route. A new hostname will
**not serve `/embed/*` until middleware explicitly recognises it** and
`/embed/*` is added to the always-public set. Framing headers cannot fix this.

**Same-site is necessary but nowhere near sufficient.** It only governs whether
cookies are *delivered*. Two separate problems remain:

- A first-time visitor has **no Clerk identity at all**, so something must mint
  an anonymous demo identity. This is real auth work, not configuration.
- A visitor who is an actual signed-in customer **does** have an identity, and
  on a same-site host their cookies are delivered to the embed. The embed must
  therefore **never derive tenancy from the ambient Clerk session** - it must
  bind to a demo identity unconditionally, or a customer could see their own
  production org rendered inside a marketing page.

Identity for the embed is issued as a **one-time code** in the iframe URL,
exchanged immediately by the embed for a short-lived, demo-only, HttpOnly
credential, with the code then scrubbed from the URL. A long-lived token
sitting in the URL leaks via history, referrers and logs. Embed responses set
`no-store` and `noindex`; credentials carry an expiry and can be revoked.

Hostname: **`demo.wayfinderos.ai` pointed at the separate demo frontend
deployment** described in §3.6 - same-site with the marketing site, but *not* the
production OS build. Do not attach it to the production OS Vercel project: that
would hand it the production build, backend and secrets, which is exactly the
failure §3.4/§3.6 exist to prevent. Budget for middleware and identity work
regardless of hostname.

### 3.2 Framing headers - clone the existing booking pattern

`Wayfinder-OS/next.config.js` already implements exactly this shape for public
booking calendars:
- `bookingHeaders` (~L234) clones `securityHeaders`, drops `X-Frame-Options`
  (correctly noted as having no allowlist mode), injects
  `frame-ancestors ${bookingFrameAncestors}` into the CSP.
- `bookingFrameAncestors` (~L147) parses **`BOOKING_FRAME_ANCESTORS`**:
  comma-separated https origins, validated per entry, wildcards/junk dropped,
  fail-closed.
- Catch-all `source` (~L322) excludes framable routes via negative lookahead.
- Covered by `tests-convex/booking-frame-headers.test.ts`.

Work: add `embedHeaders` + **`EMBED_FRAME_ANCESTORS`** for `/embed/:path*`, add
`embed/` to the catch-all lookahead, copy the header test.

**Allowlist, not `frame-ancestors *`.** `/widget/*` is deliberately open (public
chat widget). Embed routes carry a session and can write, so they must be
restricted to the marketing origins. Keep the three lists separate: widget
(open), booking (customer funnel domains), embed (marketing site).

### 3.3 Chromeless embed routes

Precedent: the `(standalone)` route group is already a bare layout with no app
chrome (used by `meet`/`room`). Embed routes follow it.

| Route | Visitor can |
|---|---|
| `/embed/ai-email` | Read the draft, send follow-up instructions, watch it redraft |
| `/embed/pipeline` | Drag deals between stages, open a deal, see payments/commissions/dashboard react |

They should visually match the placeholders they replace (`AIDraftCard.tsx`,
`OSDemo.tsx`) so the cross-fade is invisible. No links that navigate anywhere.

### 3.4 Isolated demo tenant - a separate Convex deployment

`Wayfinder-OS-demo-v2` is **a feature branch, not a demo environment** - it does
not reduce this work.

**Do not put publicly-mintable demo identities inside the production Convex
deployment.** A mutation whitelist only holds if *every* reachable path - each
called function, scheduled job, webhook, Stripe path, automation, outbound
integration - preserves the demo invariant. Stubbing transports is a fix applied
at the end of the call graph; one missed internal path reaches production
systems and real customers. Use a **separate Convex demo deployment** holding
fictional data only, with no production credentials (test-mode Stripe keys,
stub/void transport config, no real webhook targets). Then a mistake in demo
authorization is contained to the demo deployment by construction.

Within that deployment:
- Session-scoped records rather than cloning whole organisations. Seed only the
  entities and mutations the two embeds actually exercise; per-visitor
  namespacing beats template-cloning plus a cleanup job (see §7 cut list).
- Authorization still enforced in Convex functions, not the UI - assume the
  embed URL is opened directly and functions are called by hand.
- Expiry on demo sessions, with a bounded record count per session.

### 3.5 Abuse and cost control (gate, not a follow-up)

The AI-email embed is a public, un-gated, paid action:
- hard per-session generation cap,
- IP rate limit,
- global daily ceiling with a graceful "demo is busy" state and an alert,
- **no outbound side effects** - guaranteed primarily by the demo deployment
  holding no real credentials (§3.4), with transport stubs as defence in depth.

**A server-side kill switch in the product is the authoritative one.**
`NEXT_PUBLIC_OS_EMBED_ORIGIN` is compiled into client assets: unsetting it needs
a redeploy, does nothing for already-loaded frames, and nothing at all for
direct route or API access.

Disabling *issuance* alone is not enough either - already-minted credentials and
already-loaded frames keep working until they expire. **Every paid or writing
demo operation must check the switch at call time**, or flipping it must revoke
outstanding demo sessions. A switch that only stops new sessions does not stop
an attack in progress.

### 3.6 Deployment shape

`NEXT_PUBLIC_CONVEX_URL` is baked in at build time, so pointing a second
hostname at the *same* Vercel build does **not** give it a different Convex
backend. The demo therefore needs its **own frontend deployment** (separate
Vercel project, or a separate build target) wired to the demo Convex deployment,
holding no production deploy keys or secrets, and failing closed if the demo
backend URL is absent rather than falling back to production.

## 4. Risks

| Risk | Mitigation |
|---|---|
| Cross-site cookies kill the embed for many visitors | §3.1 domain choice; verify in Safari specifically |
| Demo abuse → AI bill | §3.5 caps, enforced server-side |
| Demo writes escape the sandbox org | §3.4 Convex-level authorization + whitelist |
| Landing-page perf hit from embeds | Nothing loads on paint; armed by observer; desktop only |
| Shared demo state looks broken | Ephemeral per-visitor org |
| Leads silently lost | Route fails loudly in prod; 1.3 is a launch gate |
| Framing relaxation leaks to the app | `/embed/*` scoped; catch-all keeps DENY; header test |

## 5. Sequencing

**Phase A - launch the site (no embed dependency).**
1.1 commit → deploy to a **preview** URL → 1.5 confirm domain → 1.3 verify a real
waitlist submission end to end → 1.8 privacy/terms live → **only then** promote
to production. 1.2 assets drop in as they arrive. Every embed section shows the
coded version throughout.

**Phase B - demo deployment + identity, behind a default-off flag.** Separate
Convex demo deployment (§3.4), anonymous demo identity minting, session scoping,
Convex-side authorization, caps and ceilings (§3.5), server-side kill switch.
Nothing is publicly reachable yet. This is the bulk of the work, and hardening
is *inside* it rather than after it - the moment a demo identity can be minted
publicly, the abuse surface exists.

**Phase C - route exposure.** Middleware host + public-route handling (§3.1),
`embedHeaders` + `EMBED_FRAME_ANCESTORS` (§3.2), the two chromeless routes
(§3.3) including the `wayfinder-embed-ready` handshake, **and the site-side
identity bootstrap** - `LiveEmbed` currently requests `origin + path` with no
one-time code, which is a switch-on blocker. Ship together, still flag-off.

**Phase D - adversarial verification.** Work the gate list in §6 - especially
signed-in-customer isolation, direct route access, and trying to run the AI cost
up - before anything is switched on.

**Phase E - switch on.** Set `NEXT_PUBLIC_OS_EMBED_ORIGIN` here. Watch cost and
error dashboards. Kill via the product-side switch if needed (the env var is a
slower, secondary control).

## 6. Launch gates for the embed

Beyond ordinary QA, none of these may be skipped:
- A **signed-in customer** visiting the marketing page sees demo data, never
  their own organisation.
- Works in **Safari** and in incognito/anonymous profiles.
- Opening `/embed/*` **directly** yields nothing useful, and a minted demo
  credential cannot reach production data or functions.
- Multiple tabs, and an expired/cleaned-up session, degrade gracefully.
- **Hostile framing** from an origin outside the allowlist is refused, verified
  against deployed headers rather than local config.
- The AI action **cannot be run up** past its ceilings; the alert fires.
- Core Web Vitals measured with both embeds live.

## 7. Deliberately not doing

- Cloning entire organisations per visitor - session-scoped seed records cover
  both embeds at a fraction of the machinery.
- Click-to-load buttons, which the whole design exists to avoid.
- A third embed until the first two are proven in production.

## 8. Open questions

1. Production domain for the marketing site (1.5) - decides §3.1.
2. `/api/internal/waitlist-submit` is *internal* and its own comments assume a
   browser caller (it reads `x-forwarded-for` for its 5-per-10-min limit). We
   now forward the client IP, but is proxying from this site a supported
   contract, or should there be a dedicated endpoint or shared secret? (1.3)
3. Who does the Phase B/C product work, and on which branch?
4. Is a separate Convex demo deployment acceptable operationally (cost, CI,
   schema drift from production)?
