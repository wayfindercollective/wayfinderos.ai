# Handover: what the Wayfinder OS product needs to build

**Audience:** whoever works in the `Wayfinder-OS` repo (Next 14.2.35 + Clerk +
Convex, deployed on Vercel).
**From:** the marketing site repo `wayfinderos-ai` (Next 16 + React 19).
**Status of the marketing side:** built, reviewed (three adversarial review
rounds), building clean, not yet committed or deployed.

This document is self-contained - you should not need to read anything in the
marketing repo to act on it. Line references below were verified against
`Wayfinder-OS` as of 2026-07-22.

---

## 1. The goal, in one paragraph

A visitor scrolling the public marketing site reaches the "AI email" section or
the "watch a lead become revenue" section and **starts clicking the real product,
inline in the page** - no "try it live" button, no signup, no redirect. They can
only do what is visibly on screen. Today those sections render coded
recreations of the product; the intent is to swap them for real, live modules of
Wayfinder OS embedded in the page.

There are two independent workstreams here:

- **(A) Immediate, small:** confirm/bless how the marketing site submits waitlist
  applications to the product. This is live-blocking for the site launch. §7.
- **(B) Larger:** the live embeds. §2-§6.

---

## 2. What the marketing site already provides

A component (`LiveEmbed`) wraps each coded placeholder and upgrades it to an
iframe of the product. Its behaviour is fixed and you can rely on it:

- **Pre-loads, never click-loads.** An IntersectionObserver with a 1400px
  `rootMargin` sets the iframe `src` roughly two screens before the section is
  reached, so the embed is loaded and interactive on arrival.
- **Reveals only on an explicit readiness handshake** (§5.3). The iframe `load`
  event is deliberately ignored, because it also fires for 404s, 500s, auth
  redirects and some CSP failures - which would show an error page to a visitor
  labelled as the real product.
- **Fails soft.** No handshake within 12s, any error, or a viewport under 1024px
  → the coded placeholder simply stays. The page is never worse than today.
- **Sandboxed** as `allow-scripts allow-same-origin` only. `allow-top-navigation`
  is deliberately absent, so nothing in the frame can navigate the parent page.
- Configured by one env var, `NEXT_PUBLIC_OS_EMBED_ORIGIN`. Blank = feature off.

**Not yet built on the marketing side:** the identity bootstrap (§4). It
currently requests `origin + path` with no one-time code. That is a joint task
and a switch-on blocker.

---

## 3. Three findings from your codebase that shape the design

These were verified, and each one invalidates an "obvious" approach.

### 3.1 A new hostname will not serve `/embed/*` as-is

`src/middleware.ts` treats only `admin.*` / localhost / `wayfinder-os` Vercel
hosts as the app (L112-134); `/embed` is not in the always-public set, and an
unrecognised route on a non-admin host redirects to `admin.*` (L355-357). So
pointing a new domain at the app and fixing headers is **not** sufficient.

Confirmed fix, per the OS team: add `/embed/(.*)` to `isAlwaysPublicRoute`
(L46) and give the embed host explicit handling.

> **Naming trap - a PRE-CREATION decision, not a fix.** `isAdminSubdomain`
> treats *any* `*.vercel.app` host containing `wayfinder-os` as the admin app
> (L130). Name the demo project `wayfinder-os-demo` and its preview URLs are
> misclassified as admin and hit `auth.protect()` - at which point you are
> patching middleware to undo a naming choice. **Name it without the
> `wayfinder-os` string** (e.g. `wf-os-demo`, `wfos-demo`) and the trap never
> arms. *(Flagged by the OS team.)*

### 3.2 Cookie delivery is not the auth problem - identity is

The naive plan was "host the embed same-site so Clerk cookies work in the
iframe." Same-site only governs whether cookies are *delivered*. Two problems
remain:

- A **first-time visitor has no Clerk identity at all**, so something must mint
  an anonymous demo identity. That is auth work, not configuration.
- A visitor who **is a signed-in customer** does have one, and on a same-site
  host it is delivered to the embed. If the embed reads the ambient session, a
  customer would see **their own production organisation rendered inside a
  public marketing page.**

→ The embed must bind to a demo identity **unconditionally** and must never
derive tenancy from the ambient Clerk session.

### 3.3 `NEXT_PUBLIC_CONVEX_URL` is build-time

Pointing a second hostname at the *same* Vercel build does not give it a
different Convex backend - the URL is baked in at build. A demo host attached to
the production OS project would run **production code against the production
backend with production secrets.**

→ The demo needs its **own frontend deployment** wired to its **own Convex
deployment**.

---

## 4. Demo isolation and identity (the bulk of the work)

### 4.1 Separate Convex demo deployment

Do **not** host publicly-mintable demo identities inside the production Convex
deployment. A mutation allowlist only holds if every reachable path - each
called function, scheduled job, webhook, Stripe path, automation, outbound
integration - preserves the demo invariant. Stubbing transports is a fix applied
at the *end* of the call graph; one missed internal path reaches production
systems and real customers.

Instead: a separate Convex deployment holding **fictional data only**, with no
production credentials (test-mode Stripe keys, stub/void transport config, no
real webhook targets). Then a mistake in demo authorisation is contained by
construction rather than by vigilance.

Within it:
- **Session-scoped records**, not cloned organisations. Seed only the entities
  and mutations the two embeds actually exercise; per-visitor namespacing beats
  template-cloning plus a cleanup job.
- **Authorisation enforced in Convex functions, not the UI.** Assume the embed
  URL is opened directly and functions are called by hand.
- Expiry per demo session, and a bounded record count per session.

### 4.2 Identity bootstrap

- The marketing server mints a **single-use, short-TTL, route-bound code** and
  puts it in the iframe URL.
- The embed exchanges it immediately for a **demo-only, HttpOnly, short-lived
  credential**, then **scrubs the code from the URL**.
- A long-lived token sitting in a URL leaks via history, referrers and logs -
  hence one-time-code-then-exchange rather than token-in-URL.
- Embed responses: `no-store`, `noindex`.

Needs agreeing between the two repos: who mints, the signing secret, the
exchange endpoint shape. Ping the marketing side when you're ready to define it.

### 4.3 Abuse and cost control - a gate, not a follow-up

The AI-email embed is a **public, un-gated, paid action**. Required before
anything is publicly reachable:

- hard per-session generation cap,
- IP rate limit,
- global daily ceiling, with a graceful "demo is busy" state **and an alert**,
- no outbound side effects - guaranteed primarily by the demo deployment holding
  no real credentials, with transport stubs as defence in depth.

### 4.4 Kill switch

Must be **server-side in the product** and instant. The marketing env var is
compiled into client assets - unsetting it needs a redeploy, does nothing for
already-loaded frames, and nothing at all for direct route access.

Disabling *issuance* alone is also insufficient: already-minted credentials keep
working until expiry. Either **every paid/writing demo operation checks the
switch at call time**, or flipping it **revokes outstanding demo sessions**.

---

## 5. The routes

### 5.1 Framing headers - clone your existing booking pattern

Good news: `next.config.js` already implements exactly this shape.

- `securityHeaders` sets the catch-all `X-Frame-Options: DENY`.
- `bookingHeaders` (~L234) clones it, **drops `X-Frame-Options`** (your comment
  correctly notes it has no allowlist mode and would override CSP in most
  browsers), and injects `frame-ancestors ${bookingFrameAncestors}` into the CSP.
- `bookingFrameAncestors` (~L147) parses **`BOOKING_FRAME_ANCESTORS`**:
  comma-separated https origins, validated per entry, wildcards/junk dropped,
  fail-closed. Changeable in Vercel with no code change.
- The catch-all `source` (~L322) excludes framable routes via negative lookahead.
- `tests-convex/booking-frame-headers.test.ts` covers it.

**To do:** add an `embedHeaders` block modelled on `bookingHeaders`, driven by a
new **`EMBED_FRAME_ANCESTORS`**, registered for `source: '/embed/:path*'`; add
`embed/` to the catch-all's negative lookahead; copy the header test.

**Use an allowlist, not `frame-ancestors *`.** `/widget/*` is deliberately open,
which is right for a public chat widget. Embed routes carry a session and can
write, so they must be restricted to the marketing origins - otherwise anyone can
frame your live demo inside their own page. Keep the three lists separate:
widget (open), booking (customer funnel domains), embed (marketing site).

### 5.2 Chromeless route pattern

`src/app/(standalone)/layout.tsx` is already a bare layout with no app chrome
(used by `meet` / `room`) - follow it. No sidebar, top bar, account menu, or
links that navigate anywhere.

| Route | The visitor can |
|---|---|
| `/embed/ai-email` | Read the drafted reply, send follow-up instructions ("make it more casual", "move the call to Wednesday"), watch it redraft |
| `/embed/pipeline` | Drag deals between stages, open a deal, see payments / commissions / dashboard react |

Match the marketing placeholders closely enough that the cross-fade is
invisible. (Ask the marketing side for screenshots of the current coded
versions, or run that site locally.)

### 5.3 The readiness handshake (required)

Once the module has rendered **and is genuinely interactive**, post exactly:

```js
parent.postMessage({ type: 'wayfinder-embed-ready', version: 1 }, EXPECTED_PARENT_ORIGIN)
```

- Target a specific parent origin, never `'*'`.
- The site verifies `event.origin` **and** that the message came from that
  frame's own `contentWindow` before revealing it.
- Treat it as a health signal: **do not post it if the module failed to load its
  data**, so a broken embed falls back to the coded placeholder instead of
  showing a broken product to a prospect.

---

## 6. Sequencing and launch gates

Recommended order - note hardening sits *inside* the build phase, not after it,
because the abuse surface exists the moment an identity can be publicly minted:

1. **Demo deployment + identity, flag-off.** Separate Convex deployment,
   separate frontend deployment, anonymous demo identity, session scoping,
   Convex-side authorisation, caps and ceilings, kill switch. Nothing publicly
   reachable yet.
2. **Route exposure, still flag-off.** Middleware host + public-route handling,
   `embedHeaders` + `EMBED_FRAME_ANCESTORS`, the two chromeless routes with the
   handshake, plus the marketing-side identity bootstrap.
3. **Adversarial verification** (below).
4. **Switch on** by setting `NEXT_PUBLIC_OS_EMBED_ORIGIN` on the marketing site.

**Gates - none may be skipped:**

- A **signed-in customer** browsing the marketing page sees demo data, never
  their own organisation.
- Works in **Safari** and in incognito/private profiles.
- Opening `/embed/*` **directly** yields nothing useful, and a minted demo
  credential cannot reach production data or functions.
- Multiple tabs, and an expired/cleaned-up session, degrade gracefully.
- **Hostile framing** from an origin outside the allowlist is refused - verified
  against *deployed* headers, not local config.
- The AI action **cannot be run up** past its ceilings, and the alert fires.
- Core Web Vitals measured with both embeds live.

---

## 7. Separate and more urgent: the waitlist endpoint

The marketing site's `/waitlist` form posts server-side to
**`https://wayfindercollective.io/api/internal/waitlist-submit`**, sending the
exact payload shape that endpoint expects (`fullName`, `email`, `phone`,
`businessName`, `currentSoftware`, `monthlySpend`, `biggestFrustration`,
`desiredFeature`, `utm_*`).

**Resolved by the OS team (2026-07-22):**

- **External caller is supported.** The route is registered always-public
  (`middleware.ts:72`), takes plain JSON, and injects the funnel secret
  server-side. Server-to-server is fine; no CORS involved.
- **The IP concern is smaller than first thought.** The in-memory limiter is a
  best-effort courtesy fast-path; the real per-IP limit lives in Convex
  `leadIngestion`, and the route already forwards the client IP to it
  (`route.ts:169`). Forwarding the original client IP from the marketing side is
  the right shape.

**Status-code contract - was mismatched, now fixed on the marketing side.**
The OS endpoint returns **400** for field validation failures (`route.ts:129-144`),
not 422. The marketing side originally treated only 422/429 as terminal, so a
visitor who mistyped their phone would have been misclassified as an integration
failure and silently failed over instead of being told to fix the field.

The marketing side now treats **400, 422 and 429** as terminal verdicts shown to
the visitor, and anything else (401/403/404/5xx/network) as an integration
failure - logged loudly and failed over to a backup webhook. All terminal
rejections are logged too, so a 400 caused by an integration bug is still
visible rather than hidden behind a "check your details" message.

**No change is required on the OS side for this.** If you still prefer to move
the validation branches to 422 on semantic grounds, go ahead - both codes are
accepted, so it needs no coordination and cannot break the site either way.

### Still outstanding: one live end-to-end test (launch gate)

No real submission has ever been made. **Run the assertions in this order** - the
first one exists because the test can otherwise appear to pass while the funnel
receives nothing:

1. **Confirm `WAITLIST_FUNNEL_SECRET` and `NEXT_PUBLIC_CONVEX_URL` are present in
   the `wayfindercollective.io` production Vercel env.** If either is missing the
   endpoint returns 500 (`route.ts:94-109`); the marketing side classifies that
   as an integration failure and fails the lead over to the backup webhook. The
   visitor sees success, the backup catches the lead, and **the funnel gets
   nothing** - a green-looking test hiding a dead integration. Cheap to check,
   expensive to miss. *(Flagged by the OS team.)*
2. Submit one real application from the deployed marketing site.
3. **Confirm the lead actually appears in the funnel** - not merely that the form
   showed success. Given (1), form success is not evidence of delivery.
4. Confirm the recorded IP is the visitor's, not a Vercel proxy IP - i.e. that
   the forwarded `x-forwarded-for` survived (`pickClientIp` takes the leftmost
   entry, which Vercel may rewrite on the receiving side).
5. Check the marketing-side logs for
   `[waitlist][ALERT] primary upstream FAILED` - its presence means the lead only
   reached the backup webhook, regardless of what the visitor saw. Worth wiring a
   log alert on that string permanently.

---

## 8. Open questions - answered 2026-07-22

1. **Separate Convex demo deployment** - operationally fine; it is how previews
   already work. Schema drift is the real cost, manageable with the same deploy
   tooling. ✅
2. **Branch** - Nathan's call. Net-new isolated surface, so it does not have to
   ride `feature/crm`. ⬜ *awaiting Nathan*
3. **Marketing domain / `EMBED_FRAME_ANCESTORS`** - nothing in code fixes this.
   ⬜ *awaiting Nathan* (assumption remains `wayfinderos.ai` + embed on
   `demo.wayfinderos.ai`, pointed at the **demo** frontend project, and named so
   it does not trip the `wayfinder-os` Vercel-host check in §3.1).
4. **AI provider/model + per-generation cost** - not answerable from the OS repo
   alone; depends which drafting path the embed calls. Needed to set the
   per-session and daily ceilings in §4.3. ⬜ *open*
5. **Existing demo/sandbox infra** - none to reuse (the only `/embed`-ish code is
   site-renderer content blocks, unrelated). Build fresh, but start from the
   **existing preview-seeding tooling** for the fictional data. ✅

## 9. What is actually left before launch

| Item | Owner | Blocking |
|---|---|---|
| Live end-to-end waitlist test against prod (§7) | Nathan + OS | site launch |
| Confirm final marketing domain | Nathan | site launch, and §3.1 |
| Privacy policy + terms pages | marketing side | site launch |
| Branch decision for embed work | Nathan | workstream B only |
| AI cost per generation → ceilings | OS | workstream B only |

Everything else in workstream B is buildable as specified.
