import SpaceScene from "@/components/SpaceScene";
import ClientFX from "@/components/ClientFX";
import ApplyForm from "@/components/ApplyForm";
import { Logo, ToolIcon } from "@/components/Brand";
import { TOOLS, EXTRAS, AI_POINTS, COACHING_POINTS } from "@/lib/tools";

// icon lookup by key, drawn from the single source of truth in lib/tools.ts
const svgFor: Record<string, string> = Object.fromEntries(
  [...TOOLS, ...EXTRAS].map((t) => [t.key, t.svg])
);

// the platform, as a plain spec list rather than a wall of glass cards
const modules = [
  { key: "crm", name: "CRM & pipeline", desc: "Every deal, stage and contact, wired straight to payments, calls and commissions." },
  { key: "payments", name: "Payments & checkout", desc: "Branded checkout, saved cards, plans and failed-payment chasing, running on Stripe." },
  { key: "dialer", name: "Dialer", desc: "Calls, recordings, transcripts and texts — with a real iOS and Android app." },
  { key: "inbox", name: "Inbox", desc: "Email, SMS and web chat in one thread per person, instead of three tabs." },
  { key: "email", name: "Email marketing", desc: "Segments, campaigns and the numbers behind them, in the same place as the rest." },
  { key: "booking", name: "Booking & calendar", desc: "Booking pages and two-way calendar sync, with no Calendly tab to keep open." },
  { key: "video", name: "Video rooms", desc: "Calls run inside the platform — no separate Zoom link to dig up and paste." },
  { key: "website", name: "Website & funnels", desc: "Pages and funnels built on the same data as everything else you do." },
  { key: "commissions", name: "Commissions", desc: "Tiers, brackets and per-order splits that work themselves out. No more spreadsheet." },
  { key: "automations", name: "Automations", desc: "If this, then that, across the whole stack — with quiet hours and frequency caps built in." },
  { key: "reporting", name: "Analytics", desc: "A P&L you can trust, fed by a live bank feed, plus attribution and projections." },
  { key: "team", name: "Team & leaderboards", desc: "Live activity, leaderboards and speed-to-lead, with every coach kept in their own lane." },
  { key: "portal", name: "Customer portal", desc: "Customers see their orders and pay or update a card without emailing your team." },
  { key: "compliance", name: "Compliance", desc: "TCPA, DNC, SMS consent and a HIPAA mode — your outbound stays on the right side of the line." },
];

const settle = [
  "Commissions in a spreadsheet you re-check by hand",
  "Five or six tools, none of them talking",
  "Chasing payments one email at a time",
  "Numbers that go stale the moment they move between people",
  "Reports you quietly don't believe",
];

const wayfinder = [
  "Commission numbers you'd put payroll on",
  "The whole company on one screen",
  "Payments that chase themselves",
  "Every coach in their own lane; you see all of it",
  "A P&L that's real, not a month-end guess",
];

const steps = [
  {
    n: "01",
    h: "We map your stack",
    p: "GoHighLevel, Intercom, CRM exports — pulled in with proper import tools, not copy-paste.",
  },
  {
    n: "02",
    h: "We run side by side",
    p: "Your old tools stay live, on us, until every record has moved across and been checked.",
  },
  {
    n: "03",
    h: "You switch when you're ready",
    p: "One login, nothing lost, no rushed cutover. Flip it the day you trust it, not before.",
  },
];

// TODO: replace these placeholders with real founding-operator quotes before launch.
const testimonials = [
  {
    quote:
      "We cancelled five subscriptions in the first month, and for the first time I actually trust the commission numbers.",
    name: "Placeholder name",
    company: "Placeholder Coaching Co.",
  },
  {
    quote:
      "The call summaries and draft replies save every rep a few hours a week. It's the first tool the team didn't try to work around.",
    name: "Placeholder name",
    company: "Placeholder Coaching Co.",
  },
  {
    quote:
      "One login for everyone. My coaches see their own pipeline, I see the whole floor.",
    name: "Placeholder name",
    company: "Placeholder Coaching Co.",
  },
];

const faqs = [
  {
    q: "What does it cost?",
    a: "Pricing is built around your setup. Most companies end up paying less than they did stacking GoHighLevel Elite and the tools around it — usually about 20% less.",
  },
  {
    q: "Can I automate follow-up across email, SMS and calls?",
    a: "Yes. Build a workflow off almost anything — a new lead, a deal moving stage, an inbound message, a booking — then send emails, texts, AI calls, deal updates or follow-up tasks in order. Quiet hours, frequency caps and consent rules are handled for you, so nothing fires at 2am or to someone who opted out.",
  },
  {
    q: "How much of this is really AI?",
    a: "More than you'd think, and none of it is a chatbot bolted on the side. It's woven through every part of the platform and runs in the background — scoring, drafting and surfacing the next move while you work, without you ever stopping to prompt it.",
  },
  {
    q: "Is this actually built for coaching, or just rebranded sales software?",
    a: "Built for coaching. The data model is the coaching relationship, not an agency sub-account: track students through cohorts and program history per customer, and let the AI tell you where each one is in their journey before a renewal conversation.",
  },
  {
    q: "Does it track commissions automatically?",
    a: "Yes — tiered structures, brackets and per-order allocation. Coaches move up tiers on their own and commissions recalculate across the whole team.",
  },
  {
    q: "Can I see what my sales team is actually doing?",
    a: "In real time. A live dashboard shows calls, meetings, talk time and speed-to-lead per rep, with leaderboards and a live office view. Each coach still only sees their own customers and commissions; managers see everything.",
  },
  {
    q: "Can my customers handle their own payments?",
    a: "Yes — a self-service portal lets them view orders, see what's coming up, and pay or update a card without emailing your team. Far fewer “can you resend my invoice” messages.",
  },
  {
    q: "Will it keep my outbound dialing compliant?",
    a: "Yes — built-in TCPA handling, do-not-call lists, SMS consent tracking and automatic STOP opt-outs. For medical-adjacent practices there's a HIPAA mode with encrypted records and access auditing.",
  },
  {
    q: "Is there a mobile app?",
    a: "Yes — a native iOS and Android dialer with proper call handling, plus a desktop app and an installable web app. Your reps can dial, text and check the pipeline from anywhere.",
  },
  {
    q: "Do I have to give up my accounting workflow?",
    a: "No. A live bank-feed sync (Mercury / Stripe) matches expenses for you, QuickBooks stays in step, and payments reconcile themselves — so your P&L is real, not a month-end reconstruction.",
  },
  {
    q: "How does migration work, and what if I leave?",
    a: "Import tools pull your data out of GoHighLevel, Intercom and bulk CRM exports, and we run your old stack alongside ours, on us, until everything's verified — no downtime, no rushed cutover. Your data stays yours, too: export contacts, deals, orders and financials whenever you like. The door out is as open as the door in.",
  },
];

export default function Home() {
  return (
    <>
      <SpaceScene />
      <div className="grain" />

      <nav className="site">
        <a className="brand" href="#top">
          <Logo size={30} />
          <span>
            Wayfinder <span className="os">OS</span>
          </span>
        </a>
        <div className="navcta">
          <a className="navlink" href="https://admin.wayfindercollective.io">
            Sign in
          </a>
          <a className="btn" href="#apply">
            Apply for access
          </a>
        </div>
      </nav>

      <div id="world">
        <div className="content" id="top">
          {/* HERO */}
          <section className="hero">
            <div className="eyebrow rv">Built for coaching companies</div>
            <h1 className="rv d1">
              Your whole coaching business, <em>under one roof.</em>
            </h1>
            <p className="sub rv d2">
              CRM, payments, calls, inbox, booking and commissions — the entire
              stack, in <strong>one login</strong>. Built by people who ran a
              coaching company on the exact mess you&apos;re trying to get out of.
            </p>
            <div className="hero-cta rv d3">
              <a className="btn lg" href="#apply">
                Apply for access
              </a>
              <a className="textlink" href="#problem">
                See how it fits together <span className="accent">↓</span>
              </a>
            </div>
            <div className="scrollhint">
              <div className="mouse" /> Scroll
            </div>
          </section>

          {/* PROBLEM — image-led; drop your generated illustration into the .shot frame */}
          <section id="problem">
            <div className="center">
              <div className="eyebrow rv">The problem</div>
              <div className="problem-grid">
                <div className="problem-copy rv d1">
                  <h2 className="title">You know the drill.</h2>
                  <p>
                    It&apos;s late, and you&apos;re logging into the seventh tool
                    of the day — the one you can never remember the password to,
                    so you hit &ldquo;forgot password&rdquo; one more time.
                  </p>
                  <p>
                    Commissions live in a spreadsheet you&apos;ve stopped fully
                    trusting. A lead&apos;s been sitting for two days because their
                    message landed somewhere nobody checks. None of these tools
                    talk to each other, so the last thing holding it all together
                    is you.
                  </p>
                </div>
                <div className="shot rv d2">
                  {/* Replace this placeholder with: <img src="/problem.png" alt="..." /> */}
                  <div className="placeholder">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    Illustration goes here — 16:9
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FIX */}
          <section
            id="collapse"
            style={{ minHeight: "92vh", display: "flex", alignItems: "center" }}
          >
            <div className="center" style={{ textAlign: "center", maxWidth: 720 }}>
              <div className="eyebrow rv" style={{ display: "inline-flex" }}>
                The fix
              </div>
              <h2 className="title rv d1">
                So we put it all in <em>one place.</em>
              </h2>
              <p className="lead rv d2" style={{ margin: "0 auto" }}>
                One database. One login. One set of numbers everyone&apos;s
                working from. Not seven tools bolted together and hoping — one
                system where each part already knows what the others are doing.
              </p>
            </div>
          </section>

          {/* PLATFORM */}
          <section id="platform">
            <div className="center">
              <div className="eyebrow rv">What&apos;s inside</div>
              <h2 className="title rv d1">
                Everything a coaching day actually needs.
              </h2>
              <p className="lead rv d2">
                Each one is part of the same system, not an integration taped on
                the side. Change something in one place and the rest already knows.
              </p>
              <div className="modules">
                {modules.map((m) => (
                  <div className="mod rv" key={m.key}>
                    <span className="mico">
                      <ToolIcon svg={svgFor[m.key]} size={22} />
                    </span>
                    <h3>{m.name}</h3>
                    <p>{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI */}
          <section id="ai">
            <div className="center">
              <div className="eyebrow rv">The AI in it</div>
              <h2 className="title rv d1">
                There&apos;s AI all through it — and <em>not a chatbot in sight.</em>
              </h2>
              <p className="lead rv d2">
                It works in the background — drafting, scoring, summarising,
                sounding like the coach who owns the relationship — instead of
                sitting there waiting for you to prompt it.
              </p>
              <div className="points">
                {AI_POINTS.map((p) => (
                  <div className="point rv" key={p.t}>
                    <span className="pi">
                      <ToolIcon svg={p.svg} size={22} />
                    </span>
                    <h4>{p.t}</h4>
                    <p>{p.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* STORY */}
          <section id="story">
            <div className="center story">
              <div className="eyebrow rv">Why we built it</div>
              <h2 className="title rv d1">We built this for ourselves first.</h2>
              <p className="lead rv d2">
                We ran a coaching company on seven disconnected tools and a
                commission spreadsheet we argued over every month. Nothing we
                could buy actually fixed it, so we built the thing we wanted, ran
                our own business on it for a couple of years, and now we&apos;re
                opening it up to a handful of other companies.
              </p>
            </div>
          </section>

          {/* WHY */}
          <section id="why">
            <div className="center">
              <div className="eyebrow rv">Why not just add another tool</div>
              <h2 className="title rv d1">
                You can keep stacking tools. Or you can stop.
              </h2>
              <div className="compare rv d1">
                <div className="col bad">
                  <h4>The usual setup</h4>
                  <ul>
                    {settle.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="col good">
                  <h4>On Wayfinder</h4>
                  <ul>
                    {wayfinder.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* BUILT FOR COACHING */}
          <section id="coaching">
            <div className="center">
              <div className="eyebrow rv">Made for coaching</div>
              <h2 className="title rv d1">
                Built for coaching, not borrowed from sales software.
              </h2>
              <p className="lead rv d2">
                The things a coaching business needs that an agency CRM was never
                going to bother building.
              </p>
              <div className="points two">
                {COACHING_POINTS.map((p) => (
                  <div className="point rv" key={p.t}>
                    <span className="pi">
                      <ToolIcon svg={p.svg} size={22} />
                    </span>
                    <h4>{p.t}</h4>
                    <p>{p.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section id="testimonials">
            <div className="center">
              <div className="eyebrow rv">From the floor</div>
              <h2 className="title rv d1">What it&apos;s like to run on it.</h2>
              <div className="testimonials">
                {testimonials.map((t) => (
                  <figure key={t.quote} className="tcard rv">
                    <blockquote>{t.quote}</blockquote>
                    <figcaption>
                      {t.name}, <span className="co">{t.company}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* MIGRATION */}
          <section id="migration">
            <div className="center">
              <div className="eyebrow rv">Switching over</div>
              <h2 className="title rv d1">Moving across is the easy part.</h2>
              <p className="lead rv d2">
                It&apos;s tooling-driven, runs alongside your current setup, and
                stays reversible until you&apos;re ready. No downtime, nothing
                lost.
              </p>
              <div className="steps seq">
                {steps.map((s) => (
                  <div className="step" key={s.n}>
                    <div className="n">{s.n}</div>
                    <h4>{s.h}</h4>
                    <p>{s.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* APPLY */}
          <section id="apply">
            <div className="apply rv">
              <div className="eyebrow">Founding access</div>
              <h2 className="title">Come run yours on it.</h2>
              <p className="lead">
                We&apos;re taking on a small group of coaching companies as
                founding operators — hands-on migration, a direct line to us, and
                a real say in where it goes next. Tell us about your company and
                we&apos;ll set up a call.
              </p>
              {/* TEMP: this bypasses the form to demo the hyperspace jump.
                  Swap to className="btn lg apply-open" to re-enable the Apply form. */}
              <button className="btn lg warp-trigger" type="button">
                Apply for access
              </button>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <div className="center">
              <div className="eyebrow rv">Questions</div>
              <h2 className="title rv d1">A few things people ask.</h2>
              <div className="faq">
                {faqs.map((f) => (
                  <details key={f.q} className="rv">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <footer className="site">
            <span className="brand" style={{ fontSize: 20 }}>
              <Logo size={24} />
              <span>
                Wayfinder <span className="os">OS</span>
              </span>
            </span>
            <div>© 2026 Wayfinder Collective · One place to run a coaching company.</div>
          </footer>
        </div>
      </div>

      <ApplyForm />
      <ClientFX />
    </>
  );
}
