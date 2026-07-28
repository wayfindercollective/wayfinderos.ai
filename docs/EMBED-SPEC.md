# Live embeds: what we want, for the Wayfinder-OS team

This is the authoritative intent. The engineering detail (framing headers,
middleware, the handshake, env vars) is in `EMBED-TEST-BRIEF.md`; the visual
targets are in `embed-assets/`. Where this doc and older notes disagree, this
wins. You know the full product - pick the cleanest way to expose each module;
the invariants below are the non-negotiable part.

## The idea

Embed **specific, individual modules** of Wayfinder OS directly into the
marketing site, so a visitor can *use* the real product inline - draft an email
with AI, drag a deal across pipeline stages, sit in a video room - **without
being able to navigate the rest of the system.** They can only do what's on the
screen in front of them.

## Three invariants (these are the whole point - don't compromise them)

1. **Nothing persists.** Interactions must never write to the database. A joker
   types a rude note or renames a deal "test test test" → it lives in *their
   browser tab only* and is gone on refresh; nobody else ever sees it. This is
   also what removes almost all the isolation work - no per-visitor orgs, no
   cleanup, no expiry.

   Enforce it **structurally, not by convention** (this is the approach you
   already proposed and we agree with): every embed-facing function in a single
   `convex/embed/` directory; a CI test that fails if that directory ever exports
   a mutation; queries resolve the demo org **server-side**, never from a client
   argument. Reads hit the real product code against a seeded demo org; writes
   simply don't exist on the embed surface. Anything interactive is local
   component state.

2. **No navigation out of the module.** Chromeless - no sidebar, top bar, account
   menu, or links that leave the embedded view. Follow the existing
   `(standalone)` layout pattern.

3. **Private until hardened.** For now the demo is `noindex` and reachable only
   via the marketing preview, never linked publicly - because the identity and
   AI-cost hardening below aren't built yet.

## Modules to showcase

Start with what's most convincing; you can tell us which are cheap vs costly.

1. **AI email drafting** - *already built.* Draft a reply, re-prompt it ("make it
   casual", "move the call to Wednesday"), watch it redraft. Ephemeral by nature.

2. **Pipeline** - a chromeless app-shell view: sidebar with a few modules
   (CRM / Payments / Commissions / Dashboard) and a content panel. Drag a deal
   between stages and it moves/animates/re-sorts exactly like the real board -
   **local state only, never persisted.** Seed one coherent lead→revenue story
   (spec in `embed-assets/SEED-STORY.md`) so the same deal shows up consistently
   across the panels. Visual target: `embed-assets/pipeline-*.png`.

3. **Video meeting (new) - "sit in a room and try it."** The visitor joins a
   simulated meeting:
   - **Their own camera is live** (local `getUserMedia`, shown as their tile) -
     never uploaded, never recorded, never leaves the browser.
   - Other participants are **seeded/placeholder tiles** (cameras off, avatars +
     names) - it should feel populated without real people.
   - They can **use the chat** and **send reactions/emoji**, all **browser-local**
     and ephemeral - messages vanish on refresh and no one else receives them.
   - Show the real room chrome (controls, layout, chat panel) so it reads as the
     genuine product, just single-player.
   - **Cross-repo requirement:** the marketing iframe must delegate camera/mic
     permission (`allow="camera; microphone"`). Without it `getUserMedia` rejects
     silently inside the frame. The marketing side (Nathan's repo) will add this
     for the video embed specifically - flag when the route exists so we wire it
     and test the permission prompt end to end. Also: browsers only allow camera
     access over HTTPS, and the permission prompt shows the *embed* origin, so
     `demo.wayfinderos.ai` needs a clear, trustworthy look at that moment.

4. **Your call - suggest 1-2 more.** You know what demos best. Anything read-heavy
   and visually rich (reporting/dashboards, a booking calendar, the customer
   portal) is a good candidate, as long as it obeys invariant 1.

## The marketing side is already built and waiting

- A wrapper pre-loads each embed ahead of the viewport and cross-fades it in over
  a coded placeholder - **no "try it live" button**, the visitor just arrives and
  it's interactive.
- It reveals the frame **only** on a handshake, posted once the module is truly
  interactive (and the initial data/AI call succeeded), targeting the marketing
  origin, never `'*'`:
  ```js
  parent.postMessage({ type: 'wayfinder-embed-ready', version: 1 }, parentOrigin)
  ```
  The `version: 1` field is required - the site ignores the message without it.
  Withhold the handshake on failure and the placeholder stays (correct fallback).
- Sandbox `allow-scripts allow-same-origin` (video embed also needs the `allow`
  permission delegation above). Desktop only (<1024px keeps the coded version).
- Turned on by one build-time env var on the marketing project. Full env matrix
  and the build-time-baking gotchas are in `EMBED-TEST-BRIEF.md`.

## Deferred until public (out of scope now, required before a public launch)

Unchanged: one-time-code identity so direct `/embed/*` access can't mint sessions
freely; AI abuse/cost control (per-session + IP + daily caps, alert, kill switch).
The no-write model above means **per-visitor orgs, cleanup and expiry are NOT
needed** - reads are shared and harmless, writes don't exist.

## Needed back from the marketing side / Nathan

- The marketing origin (for `EMBED_FRAME_ANCESTORS` + `NEXT_PUBLIC_EMBED_PARENT_ORIGIN`).
- Which AI provider/model backs drafting (functional gate - no key, no redraft,
  no handshake, hidden frame).
- A "go" on the video module's feasibility given your real room stack (Daily.co /
  LiveKit) - can a single-participant, no-signalling, local-only room be stood up
  cheaply, or is a faithful *mock* of the room UI the better path?
