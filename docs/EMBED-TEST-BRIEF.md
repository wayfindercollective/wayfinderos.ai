# Task brief for Wayfinder-OS: a testable live embed

Paste this into the Claude Code session running in the `Wayfinder-OS` repo. It is
scoped to a **private test milestone**, not a public launch - see "Deferred"
at the end for what is intentionally left out and must be done before this is
ever public.

## Goal

The marketing site (separate repo) iframes a live Wayfinder OS module inline.
For this milestone: get **one** module - `/embed/ai-email` - rendering in an
iframe on a deployed marketing preview, interactive, against a **separate demo
Convex deployment** with fictional data. Prove the mechanism end to end.

## The contract the marketing side already implements (don't change it)

- It sets the iframe `src = <embed-origin>/embed/ai-email` and waits.
- It reveals the iframe **only** when the embed posts, once it is rendered and
  interactive:
  ```js
  parent.postMessage({ type: 'wayfinder-embed-ready', version: 1 }, EXPECTED_PARENT_ORIGIN)
  ```
  Target the specific marketing origin, never `'*'`. Do not post it if the
  module failed to load its data - the site falls back to a placeholder, which
  is the desired behaviour for a broken embed.
- The iframe is sandboxed `allow-scripts allow-same-origin` (no top-navigation).
- Nothing loads below 1024px viewport. Ignore mobile for this milestone.

## Work items

1. **Chromeless route `/embed/ai-email`.** Follow the existing
   `src/app/(standalone)/layout.tsx` pattern (bare themed div, no sidebar / top
   bar / account menu / outbound links). Render the AI-email drafting module:
   a drafted reply the visitor can re-prompt ("make it casual", "move the call
   to Wednesday") and watch redraft. Match the marketing placeholder
   (`AIDraftCard`) closely enough that a cross-fade between them is invisible -
   ask Nathan for a screenshot or the marketing preview URL.

2. **Demo session, server-side. This is the one item that is design work, not a
   copy job - decide it deliberately.** The route must render a working module
   without a Clerk sign-in. The clean answer for this milestone: a **server-side
   demo credential the route holds** (an env secret / service identity) that
   authenticates to the demo Convex deployment as the single seeded demo org and
   renders on its behalf. This is safe *precisely because* the deployment holds
   only fictional data and no production credentials - the credential can't reach
   anything real. Do **not** reach for Clerk here, and **never derive tenancy
   from an ambient Clerk session** - if a real signed-in customer ever hit this
   it must still show demo data, never their own org. A single shared demo org is
   acceptable for the test (per-visitor isolation is a deferred, pre-public item).

3. **Framing headers - clone the booking pattern.** `next.config.js` already has
   `bookingHeaders` (~L234) driven by `BOOKING_FRAME_ANCESTORS` (~L148): it drops
   `X-Frame-Options` and injects an allowlisted `frame-ancestors`, fail-closed,
   with `tests-convex/booking-frame-headers.test.ts` covering it. Add an
   `embedHeaders` block modelled on it, driven by a new `EMBED_FRAME_ANCESTORS`,
   registered for `source: '/embed/:path*'`; add `embed/` to the catch-all
   `source` negative-lookahead (~L322); copy the header test. Use an **allowlist**
   (the marketing origin), NOT `frame-ancestors *`.

4. **Middleware.** In `src/middleware.ts`, add `/embed/(.*)` to
   `isAlwaysPublicRoute` (~L46) and give the embed host explicit handling - only
   `admin.*` / localhost / `wayfinder-os` Vercel hosts are currently treated as
   the app (~L112-134), and an unrecognised route on a non-admin host redirects
   to `admin.*` (~L355-357), so the embed host won't serve `/embed/*` otherwise.

5. **Post the ready handshake** from the module once it is genuinely interactive
   (item 1).

6. **Deploy** as a **separate Vercel project** (name it WITHOUT the string
   `wayfinder-os`, e.g. `wf-os-demo`, or its `*.vercel.app` previews get
   misclassified as the admin app by `isAdminSubdomain`, ~L130). Point it at the
   **demo Convex deployment**, holding fictional data only and **no production
   credentials** (test-mode/absent Stripe, no real email/SMS transports - so
   "approve & send" in the demo can't email a real person). Bind it to
   `demo.wayfinderos.ai` and set `EMBED_FRAME_ANCESTORS` to the marketing test
   origin.

   **"No production credentials" removes transports - it must NOT remove the AI
   provider key.** The ai-email module has to actually redraft, which means the
   demo deployment needs the AI provider/model key present and working. Without
   it the module "fails to load its data", never posts the ready handshake (item
   5), and the iframe correctly stays hidden - which looks like a plumbing bug
   but is really a missing key. So the AI key is a **functional gate for the
   test**, not just a later cost concern. Resolve the "which AI provider/model"
   question (below) before expecting a working demo.

7. **Keep it unlinked and unindexed.** Both the shared-org and free-minting
   `/embed/*` session are deferred hardening items, so for this milestone the
   demo host must be **`noindex`** and reachable **only via the marketing
   preview** - never linked from a public page or submitted to search. Treat the
   demo URL as private until the pre-public items (one-time-code identity,
   per-visitor orgs, abuse caps, kill switch) are done.

## Architecture decision (2026-07-22): embeds never write

The abuse/isolation risk exists only if visitor edits hit the database - so they
don't. **Embeds call queries, never mutations.** Data is read from the demo
backend through the real product code (so it genuinely is the product), but every
interaction - dragging a deal, retyping an email - lives in **browser state
only**. Refresh = pristine. This is already how ai-email works (draft generated,
shown, redrafted, never stored); pipeline extends the same pattern.

This **dissolves most of the deferred list**: no per-visitor orgs, no cleanup
jobs, no expiry, no session namespacing, no "why is this deal called test test
test" for the next prospect. Seed one fictional org, read-only.

Enforce it **structurally, not by convention**: the demo backend should not
expose mutations to the embed identity at all, so "no writes" can't be forgotten.
Seed with **real rows** (exercises the real queries) rather than hardcoded
fixtures.

The **only** thing this does not solve is the AI action's per-call cost - that
stays a rate-limit/ceiling problem (below), because each redraft spends money
regardless of whether anything persists.

## Still deferred until BEFORE public

Do not mistake "the test works" for "ready to ship". Still owed before this is
publicly reachable:
- One-time-code identity handshake (right now direct `/embed/*` access would mint
  a demo session freely).
- AI abuse/cost control: per-session + IP + global-daily caps, with an alert.
- A server-side kill switch that also revokes/blocks demo AI calls.

~~Ephemeral per-visitor demo orgs~~ and ~~cleanup/expiry~~ are **no longer
needed** given the no-write architecture above.

Still to build regardless: the second module, `/embed/pipeline` (see the
placeholder references in `embed-assets/`).

## Questions back to Nathan / marketing side

- The exact marketing test origin, for `EMBED_FRAME_ANCESTORS`.
- **Which AI provider/model backs the drafting - needed to make the demo *work*,
  not just to size later caps** (see item 6). The demo deployment needs a live
  key for this or the module can't post the ready handshake.
- Fuller architecture rationale is in the marketing repo's
  `docs/HANDOVER-WAYFINDER-OS.md` - ask Nathan to copy it over if useful.
