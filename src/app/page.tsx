import SpaceScene from "@/components/SpaceScene";
import ClientFX from "@/components/ClientFX";
import ApplyForm from "@/components/ApplyForm";
import { Logo, ToolIcon } from "@/components/Brand";
import { TOOLS, EXTRAS, AI_POINTS } from "@/lib/tools";

// icon lookup by key, drawn from the single source of truth in lib/tools.ts
const svgFor: Record<string, string> = Object.fromEntries(
  [...TOOLS, ...EXTRAS].map((t) => [t.key, t.svg])
);

// Coaching delivery - the live room. Kept deliberately distinct from the AI section.
const coaching = [
  {
    t: "Video rooms, built in",
    d: "Run 1:1s and cohort calls inside the platform, with attendance logged straight to each student's record.",
    svg: svgFor.video,
  },
  {
    t: "Breakout rooms",
    d: "Split a cohort into small groups for an exercise, then pull everyone back together.",
    svg: svgFor.team,
  },
  {
    t: "Cohorts & programs",
    d: "Track students through cohorts and program milestones, not just deals through pipeline stages.",
    svg: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  },
  {
    t: "Recordings & recaps",
    d: "Every session recorded and shared back to the group, without anyone having to remember to.",
    svg: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  },
];

// the platform, as a plain spec list rather than a wall of cards
const modules = [
  { key: "crm", name: "CRM & pipeline", desc: "Every deal, stage and contact, wired straight to payments, calls and commissions." },
  { key: "payments", name: "Payments & checkout", desc: "Branded checkout, saved cards, plans and failed-payment chasing, running on Stripe." },
  { key: "dialer", name: "Power dialer", desc: "Rip through a lead list back-to-back - call recording, transcripts and texts, on a real iOS and Android app." },
  { key: "inbox", name: "Inbox", desc: "Email, SMS and web chat in one thread per person, instead of three tabs." },
  { key: "email", name: "Email marketing", desc: "Segments, campaigns and the numbers behind them, in the same place as the rest." },
  { key: "booking", name: "Booking & calendar", desc: "Booking pages and two-way calendar sync, with no Calendly tab to keep open." },
  { key: "video", name: "Video rooms", desc: "Calls run inside the platform - no separate Zoom link to dig up and paste." },
  { key: "website", name: "Website & funnels", desc: "Pages and funnels built on the same data as everything else you do." },
  { key: "commissions", name: "Commissions", desc: "Tiers, brackets and per-order splits that work themselves out. No more spreadsheet." },
  { key: "automations", name: "Automations", desc: "If this, then that, across the whole stack - with quiet hours and frequency caps built in." },
  { key: "reporting", name: "Analytics", desc: "A P&L you can trust, fed by a live bank feed, plus attribution and projections." },
  { key: "team", name: "Team & leaderboards", desc: "Live activity, leaderboards and speed-to-lead, with every coach kept in their own lane." },
  { key: "portal", name: "Customer portal", desc: "Customers see their orders and pay or update a card without emailing your team." },
  { key: "compliance", name: "Compliance", desc: "TCPA, DNC, SMS consent and a HIPAA mode - your outbound stays on the right side of the line." },
];

const settle = [
  "Commissions in a spreadsheet you re-check by hand",
  "Five or six tools, none of them talking",
  "Chasing payments one email at a time",
  "Numbers that go stale the moment they move between people",
  "Reports you quietly don't believe",
];

const wayfinder = [
  "Commission numbers you trust to base payroll on",
  "The whole company on one screen",
  "Payments that chase themselves",
  "Every coach in their own lane; you survey all of it",
  "A P&L that's real, not a month-end guess",
];

const steps = [
  {
    n: "01",
    h: "We map your stack",
    p: "GoHighLevel, Intercom, CRM exports - pulled in with proper import tools, not copy-paste.",
  },
  {
    n: "02",
    h: "We run side by side",
    p: "Your old tools stay live, until every record has moved across and been checked.",
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
    a: "Pricing is built around your setup. Most companies end up paying less than they did stacking GoHighLevel Elite and the tools around it - usually about 20% less.",
  },
  {
    q: "Can I automate follow-up across email, SMS and calls?",
    a: "Yes. Build a workflow off almost anything - a new lead, a deal moving stage, an inbound message, a booking - then send emails, texts, AI calls, deal updates or follow-up tasks in order. Quiet hours, frequency caps and consent rules are handled for you, so nothing fires at 2am or to someone who opted out.",
  },
  {
    q: "How much of this is really AI?",
    a: "More than you'd think, and none of it is a chatbot bolted on the side. It's woven through every part of the platform and runs in the background - scoring, drafting and surfacing the next move while you work, without you ever stopping to prompt it.",
  },
  {
    q: "Is this built for coaches, or rebranded sales software?",
    a: "Built for coaches. The data model is the coach-student relationship, not an agency sub-account: track students through cohorts and program history per customer, and let the AI tell you where each one is in their journey before a renewal conversation.",
  },
  {
    q: "Does it track commissions automatically?",
    a: "Yes - tiered structures, brackets and per-order allocation. Coaches move up tiers on their own and commissions recalculate across the whole team.",
  },
  {
    q: "Can I see what my sales team is actually doing?",
    a: "In real time. A live dashboard shows calls, meetings, talk time and speed-to-lead per rep, with leaderboards and a live office view. Each coach still only sees their own customers and commissions; managers see everything.",
  },
  {
    q: "Can my customers handle their own payments?",
    a: "Yes - a self-service portal lets them view orders, see what's coming up, and pay towards their balance without emailing your team. Far fewer “can you resend my invoice” messages.",
  },
  {
    q: "Will it keep my outbound dialing compliant?",
    a: "Yes - built-in TCPA handling, do-not-call lists, SMS consent tracking and automatic STOP opt-outs. For medical-adjacent practices there's a HIPAA mode with encrypted records and access auditing.",
  },
  {
    q: "Is there a mobile app?",
    a: "Yes - a native iOS and Android dialer with proper call handling, plus a desktop app and an installable web app. Your reps can dial, text and check the pipeline from anywhere.",
  },
  {
    q: "Do I have to give up my accounting workflow?",
    a: "No. A live bank-feed sync (Mercury / Stripe) matches expenses for you, QuickBooks stays in step, and payments reconcile themselves - so your P&L is real, not a month-end reconstruction.",
  },
  {
    q: "How does migration work, and what if I leave?",
    a: "Import tools pull your data out of GoHighLevel, Intercom and bulk CRM exports, and we run your old stack alongside ours, on us, until everything's verified - no downtime, no rushed cutover. Your data stays yours, too: export contacts, deals, orders and financials whenever you like. The door out is as open as the door in.",
  },
];

export default function Home() {
  return (
    <>
      <SpaceScene />
      <div className="grain" />

      <nav className="site" aria-label="Primary">
        <a className="brand" href="#top">
          <Logo size={30} />
          <span>
            Wayfinder <span className="os">OS</span>
          </span>
        </a>
        <div className="navlinks">
          <a href="#platform">What&apos;s inside</a>
          <a href="#ai">The AI</a>
          <a href="#coaching">Coaching</a>
          <a href="#migration">Switching</a>
          <a href="#faq">FAQ</a>
        </div>
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
              Run your whole coaching company{" "}
              <span className="dim">from one login.</span>
            </h1>
            <p className="sub rv d2">
              CRM, payments, calls, inbox, booking and commissions - one system,
              not seven subscriptions. Built by operators who previously ran a
              coaching company on the exact same mess of systems you&apos;re
              dealing with right now.
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
              <span className="line" /> Scroll
            </div>
          </section>

          {/* PROBLEM - image bleeds to the right edge so the orbiting tools behind are covered */}
          <section id="problem">
            <div className="problem-grid">
              <div className="problem-copy">
                <div className="eyebrow rv">The problem</div>
                <h2 className="title rv d1">You know the drill.</h2>
                <p className="rv d2">
                  It&apos;s late, and you&apos;re logging into the seventh tool of
                  the day - the one you can never remember the password to, so you
                  hit &ldquo;forgot password&rdquo; one more time.
                </p>
                <p className="rv d2">
                  Commissions live in a spreadsheet you&apos;ve stopped fully
                  trusting. A lead&apos;s been sitting for two days because their
                  message landed somewhere nobody checks. None of these tools talk
                  to each other and there&apos;s money being left on the table. The
                  last thing holding it all together is you.
                </p>
              </div>
              <div className="problem-media rv d2">
                {/* Replace this placeholder with: <img src="/problem.png" alt="..." /> */}
                <div className="shot">
                  <div className="placeholder">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    Illustration · 16:9
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FIX */}
          <section id="collapse" className="fix">
            <div className="center statement">
              <div className="eyebrow rv">The fix</div>
              <h2 className="title rv d1">
                So we put it all in <span className="dim">one place.</span>
              </h2>
              <p className="lead rv d2">
                One database. One login. One set of numbers everyone&apos;s
                working from. Not seven tools bolted together and hoping - a
                single system where each part can see the rest.
              </p>
            </div>
          </section>

          {/* PLATFORM */}
          <section id="platform">
            <div className="center">
              <div className="eyebrow rv">What&apos;s inside</div>
              <h2 className="title rv d1">One system. Fourteen jobs.</h2>
              <p className="lead rv d2">
                Every module reads and writes the same records - so a deal moving
                stage updates the invoice, the commission split and the
                dashboard, without a Zapier in sight.
              </p>
              <div className="split platform-split">
                <div className="feature-list">
                  {modules.map((m) => (
                    <div className="frow" key={m.key}>
                      <span className="mico">
                        <ToolIcon svg={svgFor[m.key]} size={20} />
                      </span>
                      <div>
                        <h3>{m.name}</h3>
                        <p>{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="media-col">
                  {/* Drop your dashboard screenshot in here:
                      <img src="/dashboard.png" alt="The Wayfinder OS dashboard" /> */}
                  <div className="shot dash">
                    <div className="placeholder">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      Dashboard screenshot · 16:9
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI */}
          <section id="ai">
            <div className="center">
              <div className="eyebrow rv">AI, built in</div>
              <h2 className="title rv d1">Watch it do the busywork.</h2>
              <p className="lead rv d2">
                It drafts the replies, reviews the calls and scores the deals
                while you work.
              </p>
              {/* Drop an autoplaying demo in here (drafting an AI email, reading a
                  call, scoring a deal):
                  <video autoPlay muted loop playsInline src="/ai-demo.mp4" /> */}
              <div className="shot video rv d2">
                <div className="placeholder">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <polygon points="10 8 15 10.5 10 13 10 8" />
                  </svg>
                  Autoplaying demo · the AI drafting an email, reading a call,
                  scoring a deal
                </div>
              </div>
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

          {/* BUILT FOR COACHING - the live room */}
          <section id="coaching">
            <div className="center">
              <div className="eyebrow rv">Made for coaching</div>
              <h2 className="title rv d1">Where the coaching happens.</h2>
              <p className="lead rv d2">
                Most platforms stop at the sale. But coaching keeps going. So we
                provide the calls, the cohorts, the video meetings where the work
                gets done. That part is built in, not bolted on.
              </p>
              <div className="split coaching-split">
                <div className="point-list rv d1">
                  {coaching.map((p) => (
                    <div className="point row" key={p.t}>
                      <span className="pi">
                        <ToolIcon svg={p.svg} size={22} />
                      </span>
                      <div>
                        <h4>{p.t}</h4>
                        <p>{p.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="media-col rv d2">
                  {/* Photo of a live coaching call: <img src="/video-call.png" alt="..." /> */}
                  <div className="shot call">
                    <div className="placeholder">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                        <rect x="2" y="6" width="14" height="12" rx="2" />
                      </svg>
                      Photo of a live video call
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WHY */}
          <section id="why">
            <div className="center">
              <div className="eyebrow rv">Why not just add another tool</div>
              <h2 className="title rv d1">
                You can keep stacking tools. Or you can have everything in one
                place.
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

          {/* STORY */}
          <section id="story">
            <div className="center">
              <div className="split story-split">
                <div>
                  <div className="eyebrow rv">Why we built it</div>
                  <h2 className="title rv d1">
                    We built this for ourselves first.
                  </h2>
                  <p className="lead rv d2">
                    We ran a coaching company on seven disconnected tools and a
                    commission spreadsheet we argued over every month. Nothing we
                    could buy fixed it, so we built the thing we wanted, run our
                    own business on it, and now we&apos;re opening it up to a
                    handful of other companies.
                  </p>
                </div>
                <div className="media-col rv d2">
                  {/* Founder photo: <img src="/founder.png" alt="..." /> */}
                  <div className="shot portrait">
                    <div className="placeholder">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                      Photo of the founder
                    </div>
                  </div>
                </div>
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
              <h2 className="title rv d1">How we make moving across easy.</h2>
              <p className="lead rv d2">
                It runs alongside your current setup, and stays reversible until
                you&apos;re ready. No downtime, nothing lost.
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
              <h2 className="title">Bring your company across.</h2>
              <p className="lead">
                We&apos;re taking on a small group of coaching companies as
                founding operators - hands-on migration, a direct line to us, and
                a real say in what gets built next. Tell us about your company
                and we&apos;ll set up a call.
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
            <div className="center">
              <div className="ftop">
                <div className="fbrand">
                  <span className="brand">
                    <Logo size={26} />
                    <span>
                      Wayfinder <span className="os">OS</span>
                    </span>
                  </span>
                  <p>The operating system for coaching companies.</p>
                </div>
                <nav className="fcols" aria-label="Footer">
                  <div>
                    <h5>Product</h5>
                    <a href="#platform">What&apos;s inside</a>
                    <a href="#ai">The AI</a>
                    <a href="#coaching">Coaching</a>
                    <a href="#migration">Switching</a>
                  </div>
                  <div>
                    <h5>Company</h5>
                    <a href="#story">Why we built it</a>
                    <a href="#testimonials">Operators</a>
                    <a href="#faq">FAQ</a>
                  </div>
                  <div>
                    <h5>Get started</h5>
                    <a href="#apply">Apply for access</a>
                    <a href="https://admin.wayfindercollective.io">Sign in</a>
                  </div>
                </nav>
              </div>
              <div className="fbottom">
                <span>© 2026 Wayfinder Collective. All rights reserved.</span>
                <span>Built by operators, for operators.</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <ApplyForm />
      <ClientFX />
    </>
  );
}
