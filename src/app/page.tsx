import { existsSync } from "fs";
import { join } from "path";
import Link from "next/link";
import SpaceScene from "@/components/SpaceScene";
import ClientFX from "@/components/ClientFX";
import OSDemo from "@/components/OSDemo";
import TestimonialVideo from "@/components/TestimonialVideo";
import AIDraftCard from "@/components/AIDraftCard";
import LiveEmbed from "@/components/LiveEmbed";
import { LoginPileup, CallGridMock, DashboardShot } from "@/components/Vignettes";
import { Logo, ToolIcon } from "@/components/Brand";
import { TOOLS, EXTRAS, AI_POINTS } from "@/lib/tools";
import { SPOTS_LEFT, PRIVACY_URL, TERMS_URL } from "@/lib/waitlist";

// icon lookup by key, drawn from the single source of truth in lib/tools.ts
const svgFor: Record<string, string> = Object.fromEntries(
  [...TOOLS, ...EXTRAS].map((t) => [t.key, t.svg])
);

// Real media drops into public/media/ and appears automatically on the next build:
//   dashboard.png        - real dashboard screenshot (platform section panel)
//   coaching.mp4         - b-roll of a live coaching call (+ optional coaching.jpg poster)
//   testimonial-1.mp4    - video testimonial (+ optional testimonial-1.jpg poster)
const media = (f: string) => existsSync(join(process.cwd(), "public/media", f));

// The stresses, melting away: a pain you recognise dissolves into its relief.
const melts = [
  { pain: "The midnight commission spreadsheet, payroll due tomorrow.", relief: "It calculates itself now." },
  { pain: "Three dashboards, three different numbers.", relief: "One number. Live. True." },
  { pain: "Chasing failed payments, one awkward email at a time.", relief: "The money chases itself." },
  { pain: "A week of tool training for every new hire.", relief: "One login. They just start." },
];

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

const faqs = [
  {
    q: "What does it cost?",
    a: "Pricing is built around your setup. Most companies end up paying less than they did stacking GoHighLevel Elite and the tools around it - usually about 20% less. Founding companies run free while we tailor it to them.",
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
  const hasTestimonial = media("testimonial-1.mp4");

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
          <a href="#demo">See it work</a>
          <a href="#platform">What&apos;s inside</a>
          <a href="#coaching">Coaching</a>
          <a href="#migration">Switching</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="navcta">
          <a className="navlink" href="https://admin.wayfindercollective.io">
            Sign in
          </a>
          <Link className="btn" href="/waitlist">
            Apply to try it free
          </Link>
          <button className="menu-btn" type="button" aria-label="Menu" aria-expanded="false">
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div id="world">
        <div className="content" id="top">
          {/* HERO - centred; the canvas orbit rings around .hero-core, never over it */}
          <section className="hero">
            <div className="hero-core">
              <div className="chip rv">
                <span className="chip-dot" aria-hidden="true" />
                Founders pass · {SPOTS_LEFT} spots left
              </div>
              <h1 className="rv d1">
                It shouldn&apos;t take seven logins to run one company.
              </h1>
              <p className="sub rv d2">
                The operating system for coaching companies. One login, one set
                of numbers you can finally trust.
              </p>
              <div className="hero-cta rv d3">
                <Link className="btn lg" href="/waitlist">
                  Apply to try it free
                </Link>
                <a className="textlink" href="#demo">
                  See it in action <span className="accent">↓</span>
                </a>
              </div>
            </div>
            <div className="scrollhint">
              <span className="line" /> Scroll
            </div>
          </section>

          {/* PROBLEM - we lived this. The media column bleeds right, covering the
              orbit; the story resolves in the #collapse statement below, where the
              canvas pulls every tool into one orb with the logo inside. */}
          <section id="problem">
            <div className="problem-grid">
              <div className="problem-copy">
                <div className="eyebrow rv">We know the feeling</div>
                <h2 className="title rv d1">
                  You&apos;re the only thing holding it together.
                </h2>
                <p className="rv d2">
                  Seven logins. A commission spreadsheet you re-check at
                  midnight. A hot lead going cold in the one inbox nobody
                  watches, and money quietly leaking between tools that
                  don&apos;t talk.
                </p>
                <p className="rv d2">
                  We know, because we ran our coaching company on the exact same
                  mess - and nothing we could buy fixed it.
                </p>
              </div>
              <div className="problem-media rv d2">
                <LoginPileup />
              </div>
            </div>

            {/* the resolution of the same story - #collapse anchors the canvas
                animation that pulls every tool into the one orb with the logo */}
            <div id="collapse" className="fix">
              <div className="center statement">
                <div className="eyebrow rv">So we built the way out</div>
                <h2 className="title rv d1">
                  We put it all in <span className="dim">one place.</span>
                </h2>
                <p className="lead rv d2">
                  One database. One login. One set of numbers. We run our own
                  company on it every day - and now it&apos;s yours.
                </p>
              </div>
            </div>
          </section>

          {/* DEMO - the product, hands-on */}
          <section id="demo">
            <div className="center">
              <div className="eyebrow rv">See it work</div>
              <h2 className="title rv d1">Watch a lead become revenue.</h2>
              <p className="lead rv d2">
                A lead books, the payment collects, the commission calculates,
                the dashboard updates. Click around - or just watch.
              </p>
              {/* upgrades itself to the real product when the embed origin is
                  configured; the coded walkthrough is the placeholder. The
                  sandbox "os" frame is the shell-with-sidebar one, which is what
                  OSDemo imitates - opening on pipeline to match it. */}
              <LiveEmbed
                path="/embed/sandbox/os?start=pipeline"
                title="Wayfinder OS - live demo"
                liveHeight={720}
              >
                <OSDemo />
              </LiveEmbed>
            </div>
          </section>

          {/* RELIEF - the stresses literally melt away */}
          <section id="relief">
            <div className="center">
              <div className="eyebrow rv">What changes</div>
              <h2 className="title rv d1">Feel the stress melt away.</h2>
              <div className="melts">
                {melts.map((m) => (
                  <div className="melt rv" key={m.relief}>
                    <span className="pain">{m.pain}</span>
                    <h4 className="relief-line">{m.relief}</h4>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PLATFORM */}
          <section id="platform">
            <div className="center">
              <div className="eyebrow rv">What&apos;s inside</div>
              <h2 className="title rv d1">One system. Fourteen jobs.</h2>
              <p className="lead rv d2">
                Every module reads the same records. A deal moves, and the
                invoice, commission and dashboard already know.
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
                  {media("dashboard.png") ? (
                    <div className="shot dash-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/media/dashboard.png" alt="The Wayfinder OS dashboard" />
                    </div>
                  ) : (
                    /* a real, live dashboard beside the module list - the coded
                       shot is the placeholder it cross-fades over */
                    <LiveEmbed
                      path="/embed/sandbox/dashboard"
                      title="Wayfinder OS dashboard - live demo"
                      liveHeight={700}
                    >
                      <DashboardShot />
                    </LiveEmbed>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* AI */}
          <section id="ai">
            <div className="center">
              <div className="eyebrow rv">AI, built in</div>
              <h2 className="title rv d1">It does the busywork before you ask.</h2>
              <p className="lead rv d2">
                It drafts replies, reviews calls and scores deals while you
                work. Watch it write:
              </p>
              <div className="ai-vignette rv d2">
                <LiveEmbed
                  path="/embed/sandbox/composer"
                  title="Wayfinder OS AI email drafting - live demo"
                  liveHeight={920}
                >
                  <AIDraftCard />
                </LiveEmbed>
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
                Most platforms stop at the sale. Coaching keeps going - so the
                calls, cohorts and video rooms are built in, not bolted on.
              </p>
              {/* the room is a full-width stage: a real meeting UI squeezed into
                  a half column gets clipped and reads as broken */}
              <div className="coaching-stage rv d1">
                {media("coaching.mp4") ? (
                  <div className="shot call wide">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      src="/media/coaching.mp4"
                      poster={media("coaching.jpg") ? "/media/coaching.jpg" : undefined}
                    />
                  </div>
                ) : (
                  /* The live room needs camera+mic delegated into the frame or
                     getUserMedia rejects silently and the demo looks broken. */
                  <LiveEmbed
                    path="/embed/sandbox/room"
                    title="Wayfinder OS video room - live demo"
                    allow="camera; microphone; display-capture"
                    liveHeight={680}
                  >
                    <CallGridMock />
                  </LiveEmbed>
                )}
              </div>
              <div className="points coaching-points">
                {coaching.map((p) => (
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

          {/* PROOF - real video testimonial; renders only when the file exists */}
          {hasTestimonial && (
            <section id="proof">
              <div className="center">
                <div className="eyebrow rv">From the floor</div>
                <h2 className="title rv d1">What it&apos;s like to run on it.</h2>
                <TestimonialVideo
                  src="/media/testimonial-1.mp4"
                  poster={media("testimonial-1.jpg") ? "/media/testimonial-1.jpg" : undefined}
                  caption="A founding operator on moving their company across."
                />
              </div>
            </section>
          )}

          {/* MIGRATION */}
          <section id="migration">
            <div className="center">
              <div className="eyebrow rv">Switching over</div>
              <h2 className="title rv d1">
                Scared of the move? How we make it easy.
              </h2>
              <p className="lead rv d2">
                It runs alongside your current setup and stays reversible until
                you&apos;re ready. Nothing lost, no downtime.
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

          {/* APPLY - founders pass */}
          <section id="apply">
            <div className="apply rv">
              <div className="eyebrow">Founders pass</div>
              <h2 className="title">Try it free. Help shape it.</h2>
              <p className="lead">
                {SPOTS_LEFT} founding companies get Wayfinder OS free while we
                tailor it to them - hands-on migration, a direct line to the
                builders. When the seats fill, the door closes.
              </p>
              <div className="spots" aria-label={`${SPOTS_LEFT} founders pass spots left`}>
                {Array.from({ length: SPOTS_LEFT }).map((_, i) => (
                  <span key={i} aria-hidden="true" />
                ))}
                <em>{SPOTS_LEFT} spots left</em>
              </div>
              {/* the warp-trigger plays the hyperspace jump, then lands on /waitlist;
                  without JS it's a plain link to the same place */}
              <a className="btn lg warp-trigger" href="/waitlist">
                Apply to try it free
              </a>
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
                    <a href="#demo">See it work</a>
                    <a href="#platform">What&apos;s inside</a>
                    <a href="#ai">The AI</a>
                    <a href="#coaching">Coaching</a>
                    <a href="#migration">Switching</a>
                  </div>
                  <div>
                    <h5>Company</h5>
                    <a href="#problem">Why we built it</a>
                    <a href="#faq">FAQ</a>
                    <a href={PRIVACY_URL}>Privacy</a>
                    <a href={TERMS_URL}>Terms</a>
                  </div>
                  <div>
                    <h5>Get started</h5>
                    <Link href="/waitlist">Apply to try it free</Link>
                    <a href="https://admin.wayfindercollective.io">Sign in</a>
                  </div>
                </nav>
              </div>
              <div className="fbottom">
                <span>© 2026 Wayfinder Collective. All rights reserved.</span>
                <span className="flegal">
                  <a href={PRIVACY_URL}>Privacy policy</a>
                  <a href={TERMS_URL}>Terms of service</a>
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <ClientFX />
    </>
  );
}
