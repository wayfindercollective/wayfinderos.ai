# Wayfinder OS — Website Design & Build Plan

> First impression of a product six months in the making. The site itself must feel
> like the product: one system, beautifully unified, alive.

## 0. Locked decisions
- **Scope:** Wayfinder OS product site only (not the Collective umbrella).
- **Primary CTA:** **Apply for access** / **Book a call** (selective, premium — framed as an
  application, not a passive waitlist). Single dominant action repeated down the page.
- **Aesthetic:** **Spatial / WebGL** — a constellation of tool-nodes orbiting and collapsing
  into one glowing core. The hero metaphor *is* the value prop: everything in one place.

---

## 1. Positioning & narrative spine
The whole page is one argument, told in scenes:

1. **Hook (hero):** *Everything orbits. Nothing leaves.* — ten tools, one core.
2. **The pain:** the duct-taped stack (5+ tools, spreadsheets, reports you can't trust).
3. **The collapse (signature moment):** scattered tool-logos fly in and fuse into the Wayfinder core.
4. **The system, module by module:** CRM · Payments · Dialer · Inbox · Email · Booking ·
   Video · Web Chat · Website builder · Commissions — each with a live UI peek.
5. **Why us, not GoHighLevel:** built for coaching companies, not agencies.
6. **Proof / trust:** real-time accuracy, coach isolation, migrations with no downtime.
7. **The ask:** Apply for access (qualifying, exclusive).

### Copy direction
- Hero H1: **Everything orbits. Nothing leaves.**
- Sub: *CRM, payments, dialer, inbox, booking, video, email, and your website — ten tools
  collapsed into one core. The operating system built for coaching companies.*
- Retain the proven jab: *"GoHighLevel was built for agencies. This was built for coaching companies."*
- Keep *"Stop duct-taping your business together"* as the pain-section headline (it's strong).

---

## 2. Information architecture (single long-scroll, anchored nav)
| # | Section | Job | Signature motion |
|---|---------|-----|------------------|
| 1 | Hero | Hook + metaphor + CTA | Orbiting constellation, mouse-parallax core |
| 2 | The problem | Agitate the duct-taped stack | Logos scattered, jittering, disconnected |
| 3 | The collapse | Resolve the tension | Scroll-scrubbed: tools fuse into the core |
| 4 | Platform modules | Show the breadth, prove it's real | Sticky-scroll panels, live UI mock peeks |
| 5 | Real-time accuracy | Differentiator: trustworthy data | Numbers count up, dashboards update live |
| 6 | Coach isolation / multi-tenant | Security/trust for teams | Split-view, data stays in lanes |
| 7 | Why Wayfinder vs settle-for | Head-to-head | Animated comparison reveal |
| 8 | Migration | De-risk the switch | "No downtime" timeline animation |
| 9 | Apply (CTA) | Convert | Core re-forms, glowing application card |
| 10 | Footer | Sitemap, legal, brand | Subtle starfield fade-out |

---

## 3. Design system
**Mood:** deep-space dark, surgical precision, cyan energy. Premium, not flashy.

- **Color**
  - Background: `#06080c` → `#0a0e15` (near-black, slight blue)
  - Ink: `#eef3f8` / Muted: `#8a97a8`
  - Accent: cyan `#22d3ee`, teal `#2dd4bf`, blue `#38bdf8` (gradient range)
  - Surfaces: glass `rgba(255,255,255,.04)` + 1px hairline borders `rgba(255,255,255,.08)`
- **Type**
  - Display: **Space Grotesk** (geometric, matches brand wordmark feel) — tight tracking.
  - Body/UI: **Inter**.
  - Mono (data/metrics): **Geist Mono** (already in repo).
- **Logo:** the upward "wayfinder arrow" mark (recreated as inline SVG with the cyan→teal gradient).
- **Texture:** film grain overlay (~3.5%), radial vignette, soft glows via shadow/blur.
- **Spacing:** generous, lots of black; let the animation breathe.

---

## 4. Motion system (the differentiator)
Principle: motion is **diegetic** — it explains the product, never decorates for its own sake.
Space theme: Wayfinder is an arrow; the product is a solar system orbiting one sun. Everything
respects `prefers-reduced-motion` (static, elegant fallbacks).

### The three canvas states (one continuous scene, scrubbed by scroll)
The phase is **driven off measured section positions**, not arbitrary scroll distances, so the
visuals line up exactly with the copy.
1. **Hero — POSITIVE / orderly.** Calm tool-nodes (each an icon + label) orbiting one soft sun;
   data-pulses flow inward. This is "what we built," and it looks good on purpose.
2. **Problem — NEGATIVE / violent.** Aligned to the problem section: **there is no sun.** Tools
   break orbit and careen around in a chaotic, crossing wander; a red tangle wires everything to
   everything; some systems flicker, fail and fall away/die. As messy and wrong as possible.
3. **Resolution — HEALING / orb.** Aligned to the "into one core" section: red heals to cyan, the
   tangle dissolves, everything implodes into **one bright orb with the Wayfinder logo inside it.**

### Signature interactions
- **Hyperspace jump on Apply submit:** clicking Apply triggers a Star-Wars-style lightspeed warp
  (accelerating starfield streaks → white flash → "Welcome aboard" arrival card). The space theme
  pays off at the moment of conversion.
- **Scroll engine:** Lenis smooth-scroll + GSAP ScrollTrigger scrubbed timelines for the 3 states.
- **Reveals:** staggered fade/translate on enter (intersection-driven), buttery easing.
- **Modules:** sticky-pinned section where copy changes as live UI panels swap.
- **Micro:** magnetic CTA, count-up metrics, cursor-aware glows.

### Readability rule
The orb glow sits center-right and bleeds across lower sections, so **all cards/panels get an
opaque dark base + backdrop-blur** — content stays crisp regardless of what's glowing behind it.

### Hero restraint
The hero is deliberately sparse: kicker + headline + one short line + a single CTA. The *scene*
is the spectacle; the copy gets out of its way.

---

## 5. Technical foundation (reviewed June 2026)
Goal: a stack we build once and don't have to redo — smooth, consistent, low-churn.

### Rendering decision — why NOT React-Three-Fiber
R3F v9 + drei v10 + postprocessing *do* run on React 19 / Next 16, but there are documented
fragilities at exactly that intersection: the React 19.2 reconciler bump broke R3F, and
drei/postprocessing components (e.g. `EffectComposer`, `RenderTexture`) need manual `__r3f`
patches under React 19. More importantly, **our scenes are particle/line/glow systems, not
3D-model scenes** — R3F's declarative scene-graph value barely applies while its weight and
version-fragility fully apply. Wrong tool for this job.

### Chosen stack
| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next 16 App Router · React 19 · TS · Tailwind v4 | already scaffolded, current |
| WebGL scenes (constellation, chaos, orb, hyperspace) | **OGL** (~30kb) + custom GLSL; Canvas2D + poster fallback | GPU additive bloom, thousands of particles @60fps, **no React-reconciler coupling → no churn** |
| Smooth scroll | **Lenis** (`lenis/react`) driven by GSAP ticker (`autoRaf:false`) | industry standard, one RAF loop |
| Scroll-scrubbed timelines + reveals | **GSAP + ScrollTrigger** | now 100% free incl. all plugins (Webflow, Apr 2025); frame-locks chaos→orb to scroll |
| Micro-interactions | GSAP + CSS | single animation engine, no second paradigm |

### Performance & resilience rules
- Lazy-load WebGL below the fold; pause RAF when the canvas is offscreen (IntersectionObserver).
- Cap DPR at 2; ship a static poster for first paint (LCP target < 2.5s on mid hardware + mobile).
- Full `prefers-reduced-motion` path: static, elegant compositions — no motion, still beautiful.
- Mobile: lower particle counts + simpler shaders behind a feature/quality check.
- **Forms:** Apply flow = multi-step qualifying application (Server Actions / route handler),
  with the hyperspace warp as the submit transition.

> Per `AGENTS.md`, this Next.js has breaking changes — we read the bundled docs in
> `node_modules/next/dist/docs/` before writing app code (fonts, metadata, CSS, client comps).
> *Open decision the user may override: use OGL (recommended) vs. R3F if the team prefers that ecosystem.*

---

## 6. Build phases
1. **Foundation** — design tokens in `globals.css`, fonts, layout shell, nav, logo SVG, smooth scroll.
2. **Hero** — port the mockup constellation into a React client component (canvas first, R3F optional).
3. **Narrative sections** — problem → collapse → modules (the meat), with scroll motion.
4. **Differentiators + comparison + migration** — trust-building scenes.
5. **Apply flow** — multi-step application, validation, success state.
6. **Polish** — responsive/mobile, reduced-motion, a11y, SEO/OG, perf pass.
7. **Review** — `/code-review` + a manual `/verify` run in the real app.

---

## 7. Risks & mitigations
- **WebGL perf on low-end/mobile** → 2D-canvas baseline + static poster fallback; feature-detect.
- **Animation overwhelming the message** → copy-first; motion clarifies, never blocks reading.
- **Scope creep** → the long-scroll is the MVP; Apply flow + modules are the must-haves.

---

## 8. What's in the mockup (`mockups/hero.html`)
A self-contained, openable hero proving the spatial direction: orbiting labelled tool-nodes,
depth-sorted with parallax, pulsing data-lines into a breathing core, brand wordmark, nav,
"Apply for access" CTA, hero copy, proof bar, scroll hint. Open it directly in a browser.
This is the *direction*, not the final polish — we tune from here.
