import { existsSync } from "fs";
import { join } from "path";
import Link from "next/link";
import SpaceScene from "@/components/SpaceScene";
import ClientFX from "@/components/ClientFX";
import OSDemo from "@/components/OSDemo";
import TestimonialVideo from "@/components/TestimonialVideo";
import AIDraftCard from "@/components/AIDraftCard";
import LiveEmbed from "@/components/LiveEmbed";
import { CallGridMock, DashboardShot } from "@/components/Vignettes";
import { Logo, ToolIcon } from "@/components/Brand";
import { TOOLS, EXTRAS } from "@/lib/tools";
import {
  SPOTS_LEFT,
  SPOTS_TAKEN,
  SPOTS_TOTAL,
  TAKEN_WORD,
  TAKEN_WORD_CAP,
  TOTAL_WORD,
  TOTAL_WORD_CAP,
  NEXT_SEAT_ORDINAL,
  PRIVACY_URL,
  TERMS_URL,
} from "@/lib/waitlist";

// icon lookup by key, drawn from the single source of truth in lib/tools.ts
const svgFor: Record<string, string> = Object.fromEntries(
  [...TOOLS, ...EXTRAS].map((t) => [t.key, t.svg])
);

// Real media drops into public/media/ and appears automatically on the next build:
//   dashboard.png        - real dashboard screenshot (platform section panel)
//   coaching.mp4         - b-roll of a live coaching call (+ optional coaching.jpg poster)
//   testimonial-1.mp4 .. testimonial-6.mp4 - founder video testimonials, in seat
//   order (+ optional matching testimonial-N.jpg posters). Names/captions below.
const media = (f: string) => existsSync(join(process.cwd(), "public/media", f));

// Captions for the founder videos, by number. Fill in real names/companies as
// the videos land; a missing entry just renders without a caption.
const TESTIMONIAL_CAPTIONS: Record<number, string> = {
  1: `Cbaas · one of the first ${TAKEN_WORD} on board`,
};

// Say this -> get that. Concrete proof of the one claim, in the visitor's own
// words. Deliberately ordinary sentences, not prompt-engineering.
const SAY_THIS = [
  { q: "Who's gone quiet this week?", a: "Every deal with no reply, ranked by what it's worth." },
  { q: "Follow up with Sarah about the payment plan.", a: "Written in your voice, waiting for your nod." },
  { q: "How much did we actually collect this month?", a: "Collected, not “closed won”. Closed is a story - collected is a fact." },
  { q: "Book Leo in for Thursday.", a: "Held, invited, reminded." },
];

// Admit the negative and you're believed on everything else. Every line here is
// true and disqualifies somebody - that's the point, not a rhetorical trick.
const NOT_FOR = [
  {
    t: "It's opinionated.",
    d: "We built it for ourselves first, so it has strong defaults instead of a thousand settings. If you want infinitely configurable white-label software, GoHighLevel is right there.",
  },
  {
    t: "It has hands on your money.",
    d: "The assistant can act - email, call, charge. So every action is permission-gated and logged, and money never moves without your say-so. If you want an AI with no leash at all, that's not this.",
  },
  {
    t: "We're new.",
    d: `${TAKEN_WORD_CAP} companies run on it today, and you'd be the ${NEXT_SEAT_ORDINAL} - not the ten-thousandth. That means our phone number, and a say in what gets built. It also means you're early.`,
  },
  {
    t: "We only take coaching companies.",
    d: "Agencies, e-com, everyone else: no. The whole thing is shaped around coach and student, and it shows.",
  },
];

// The stresses, melting away: a pain you recognise dissolves into its relief.
const melts = [
  { pain: "The midnight commission spreadsheet, payroll due tomorrow.", relief: "It calculates itself now." },
  { pain: "Three dashboards, three different numbers.", relief: "Collected. To the cent." },
  { pain: "Chasing failed payments, one awkward email at a time.", relief: "You never send that email again." },
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
    t: "Attendance, logged",
    d: "Who showed and who's slipping, written to each student's record - without anyone taking a register.",
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
    a: "Pricing is built around your setup. Most companies end up paying less than the GoHighLevel-Elite-plus-add-ons stack they replace. Founding companies run free while we tailor it to them.",
  },
  {
    q: "Can I automate follow-up across email, SMS and calls?",
    a: "Yes. Build a workflow off almost anything - a new lead, a deal moving stage, an inbound message, a booking - then send emails, texts, AI calls, deal updates or follow-up tasks in order. Quiet hours, frequency caps and consent rules are handled for you, so nothing fires at 2am or to someone who opted out.",
  },
  {
    q: "Isn't this just GoHighLevel with a chatbot on top?",
    a: "No, and the difference is the whole company. A chatbot sits beside software you still have to drive. Here, talking is how you drive it - the assistant reads and writes the same records as every module, so asking for something is the same action as doing it. The honest version: GoHighLevel has more features. We have fewer screens. Pick the problem you actually have.",
  },
  {
    q: "What happens when it gets something wrong?",
    a: "You see it before it goes out. Drafts wait for your nod, and anything that moves money or touches a customer shows you what it's about to do first. It's an assistant with its hands on the controls, not an autopilot you hope for the best with.",
  },
  {
    q: "Is this built for coaches, or rebranded sales software?",
    a: "Built for coaches - by a coaching company, for how one actually runs. Sessions, attendance and recordings live on the same customer record as the deals and the payments, so delivery and revenue sit in one place instead of an agency sub-account bolted onto sales software.",
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
  const testimonialVideos = [1, 2, 3, 4, 5, 6].filter((n) =>
    media(`testimonial-${n}.mp4`)
  );

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
          <a href="#demo">Talk to it</a>
          <a href="#platform">What&apos;s inside</a>
          <a href="#coaching">Coaching</a>
          <a href="#honest">Honest bit</a>
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
                Founders pass · {SPOTS_LEFT} of {SPOTS_TOTAL} seats left
              </div>
              <h1 className="rv d1">Talk to your business.</h1>
              <p className="sub rv d2">
                Ask what you collected. Ask who&apos;s gone quiet. Tell it what
                to do about both - it&apos;s drafted, booked, and waiting for
                your nod. The coaching OS that answers you, with the truth.
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
            <div className="center statement">
              <div className="eyebrow rv">The race</div>
              <h2 className="title rv d1">
                You&apos;re in a horse and cart.{" "}
                <span className="dim">They just bought a racecar.</span>
              </h2>
              <p className="lead rv d2">
                This isn&apos;t coming - it&apos;s here. {TAKEN_WORD_CAP}{" "}
                coaching companies already run on it - and they&apos;re pulling
                away. You&apos;re not slower because you&apos;re worse at this.
                You&apos;re slower because of what you&apos;re driving.
              </p>
            </div>

            {/* the resolution of the same beat - #collapse anchors the canvas
                animation that pulls every tool into the one orb with the logo */}
            <div id="collapse" className="fix">
              <div className="center statement">
                <h2 className="title rv d1">
                  So we demoted <span className="dim">the dashboard.</span>
                </h2>
                <p className="lead rv d2">
                  It&apos;s still in there - it&apos;s just not your job
                  anymore. You ask, it answers, it acts. And when you do open a
                  screen, the number on it is collected cash, matched against
                  your live bank feed - not a story about closed-won.
                </p>
              </div>
            </div>
          </section>

          {/* THE ONE THING - talking to it. This is the whole pitch; everything
              below is evidence that it's real, not a second sales argument. */}
          <section id="demo">
            <div className="center">
              <div className="eyebrow rv">The one thing</div>
              <h2 className="title rv d1">Just say what you want.</h2>
              <p className="lead rv d2">
                Nothing to learn. You say it in a sentence and it&apos;s
                written, sent, updated, booked. This is the real product, not a
                video - go on, type something.
              </p>
              <div className="ai-vignette rv d2">
                <LiveEmbed
                  path="/embed/sandbox/composer"
                  title="Wayfinder OS AI writing assistant - live demo"
                  focusOnVisible
                  liveHeight={920}
                >
                  <AIDraftCard />
                </LiveEmbed>
              </div>
              <div className="says">
                {SAY_THIS.map((s) => (
                  <div className="say rv" key={s.q}>
                    <span className="say-q">&ldquo;{s.q}&rdquo;</span>
                    <span className="say-a">{s.a}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROOF - the quote, verbatim and attributed. No big-number theatre:
              on a page about numbers you can trust, an unmeasurable percentage
              in 130px type would be the one thing here that isn't in the page's
              own currency. The video testimonials below carry the weight. */}
          <section id="proof">
            <div className="center statement">
              <div className="eyebrow rv">From seat one</div>
              <blockquote className="bigquote rv d1">
                &ldquo;A 50% increase in productivity.&rdquo;
              </blockquote>
              <p className="lead rv d2">
                <span className="attrib">Cbaas · one of the first {TAKEN_WORD} on board</span>
              </p>
            </div>
          </section>

          {/* CANDOR - admit the negative. Disqualifying people is the point. */}
          <section id="honest">
            <div className="center">
              <div className="eyebrow rv">Before you apply</div>
              <h2 className="title rv d1">It&apos;s probably not for you.</h2>
              <p className="lead rv d2">
                We&apos;d rather lose you here than three months in. So, plainly:
              </p>
              <div className="nots">
                {NOT_FOR.map((n) => (
                  <div className="not rv" key={n.t}>
                    <h4>{n.t}</h4>
                    <p>{n.d}</p>
                  </div>
                ))}
              </div>
              <p className="lead rv d2 nots-close">
                Still here? Then you&apos;re exactly who we built it for.
              </p>
            </div>
          </section>

          {/* THE FIRST THREE - founder videos, seat order. Renders once the
              files exist in public/media/; the seat meter in #apply agrees. */}
          {testimonialVideos.length > 0 && (
            <section id="operators">
              <div className="center">
                <div className="eyebrow rv">The first {TAKEN_WORD}</div>
                <h2 className="title rv d1">
                  {TAKEN_WORD_CAP} of the {TOTAL_WORD} seats are taken.
                </h2>
                <p className="lead rv d2">
                  These are the companies already running on it - in their own
                  words, not ours.
                </p>
                <div className="tvideos">
                  {testimonialVideos.map((n) => (
                    <TestimonialVideo
                      key={n}
                      src={`/media/testimonial-${n}.mp4`}
                      poster={media(`testimonial-${n}.jpg`) ? `/media/testimonial-${n}.jpg` : undefined}
                      caption={TESTIMONIAL_CAPTIONS[n]}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* RELIEF - the stresses literally melt away */}
          <section id="relief">
            <div className="center">
              <div className="eyebrow rv">What changes</div>
              <h2 className="title rv d1">What stops being your job.</h2>
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
              <div className="eyebrow rv">Under the hood</div>
              <h2 className="title rv d1">The truth, to the cent.</h2>
              <p className="lead rv d2">
                CRM, payments, calls, booking, commissions - one database, so
                nothing disagrees with anything. That dashboard is the real one,
                live: orders and collected cash, not projections. Ask for a
                number, and this is where it comes from.
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
              <div className="eyebrow rv">Everywhere at once</div>
              <h2 className="title rv d1">
                One sentence moves the whole company.
              </h2>
              <p className="lead rv d2">
                Say it once and the deal, the invoice, the commission and the
                dashboard already know. This is the business it&apos;s running -
                click anything.
              </p>
              <LiveEmbed
                path="/embed/sandbox/pipeline"
                title="Wayfinder OS - live demo"
                liveHeight={720}
              >
                <OSDemo />
              </LiveEmbed>
              <p className="lead rv lead-after">
                And while you&apos;re in here, it&apos;s working the rest:
                scoring every lead, reading every call, writing the summary and
                the next move - without being asked.
              </p>
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
              <h2 className="title">
                {TOTAL_WORD_CAP} companies. That&apos;s the whole list.
              </h2>
              <p className="lead">
                {TAKEN_WORD_CAP} seats are already taken. The remaining{" "}
                {SPOTS_LEFT} get Wayfinder OS free while we shape it around
                them - hands-on migration, our phone numbers, a real say in
                what gets built. We&apos;re taking {TOTAL_WORD} because{" "}
                {TOTAL_WORD} is what we can do properly. Then the door closes.
              </p>
              <div
                className="spots"
                aria-label={`${SPOTS_TAKEN} of ${SPOTS_TOTAL} founders pass seats taken, ${SPOTS_LEFT} left`}
              >
                {Array.from({ length: SPOTS_TOTAL }).map((_, i) => (
                  <span key={i} className={i < SPOTS_TAKEN ? "taken" : ""} aria-hidden="true" />
                ))}
                <em>{SPOTS_TAKEN} taken · {SPOTS_LEFT} left</em>
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
                    <a href="#demo">Talk to it</a>
                    <a href="#platform">What&apos;s inside</a>
                    <a href="#ai">Ask it anything</a>
                    <a href="#coaching">Coaching</a>
                    <a href="#migration">Switching</a>
                  </div>
                  <div>
                    <h5>Company</h5>
                    <a href="#honest">The honest bit</a>
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
