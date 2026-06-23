import SpaceScene from "@/components/SpaceScene";
import ClientFX from "@/components/ClientFX";
import ApplyForm from "@/components/ApplyForm";
import { Logo, ToolIcon } from "@/components/Brand";
import { TOOLS } from "@/lib/tools";

const problems = [
  "GoHighLevel",
  "Pipedrive",
  "Stripe dashboard",
  "Calendly",
  "Zoom",
  "A dialer app",
  "Commission spreadsheet",
];

const featured = TOOLS.slice(0, 2);
const rest = TOOLS.slice(2);
const featuredDesc: Record<string, string> = {
  crm: "Every deal, stage and contact in one pipeline — wired live to payments, bookings and commissions. Bulk-action a hundred records and the dashboards update instantly.",
  payments: "Stripe and QuickBooks, native. Saved cards, subscriptions, and payment plans that chase failed charges for you. Revenue reconciles itself.",
};
const featuredTags: Record<string, string[]> = {
  crm: ["Pipelines", "Deal stages", "Bulk actions", "Live analytics"],
  payments: ["Stripe", "QuickBooks", "Subscriptions", "Payment plans", "Auto-dunning"],
};

const stats = [
  { to: 10, suffix: "+", lbl: "tools replaced" },
  { to: 20, suffix: "%", lbl: "saved on stack cost" },
  { to: 1, suffix: "", lbl: "source of truth" },
  { to: 0, suffix: "", lbl: "integrations to babysit" },
];

const settle = [
  "Commissions tracked in spreadsheets",
  "5+ tools duct-taped together",
  "Manual payment follow-ups",
  "Data leaking between team members",
  "Reports you can't trust",
];

const wayfinder = [
  "Automatic commission calc & tiers",
  "One platform, zero integrations",
  "Payment plans that run themselves",
  "Coach isolation from day one",
  "Dashboards you can actually trust",
];

const steps = [
  {
    h: "We map your stack",
    p: "GoHighLevel, Intercom, CRM exports — imported with dedicated tooling, not copy-paste.",
  },
  {
    h: "We run in parallel",
    p: "Your existing tools stay live, at no extra cost, until every record is migrated and verified.",
  },
  {
    h: "You go live",
    p: "One login, zero data loss, no rushed cutover. Switch the moment you trust it.",
  },
];

const faqs = [
  {
    q: "What does it cost?",
    a: "Pricing is custom to your setup. Most companies save at least 20% versus stacking GoHighLevel Elite and the tools around it.",
  },
  {
    q: "How does the migration work?",
    a: "We run your existing systems in parallel at no extra cost until your data is fully migrated and verified. Dedicated import tools for GoHighLevel, Intercom and bulk CRM data — no downtime, no risk.",
  },
  {
    q: "Does it track commissions automatically?",
    a: "Yes — tiered structures, brackets and per-order allocation. Coaches move up tiers automatically and commissions recalculate across your whole team.",
  },
  {
    q: "Is there a dialer?",
    a: "Yes — call recording, transcription, SMS and number porting, plus AI voice campaigns that dial and qualify leads. Works on desktop and mobile.",
  },
  {
    q: "Can each coach have their own dashboard?",
    a: "Yes. Multi-coach isolation from day one — each coach sees only their own customers, orders and commissions. No data leaks between team members.",
  },
  {
    q: "Do I get real financial reporting?",
    a: "Full P&L with monthly views and forward projections, sales attribution, expense matching and margin analysis — reporting your accountant will recognise.",
  },
];

export default function Home() {
  return (
    <>
      <SpaceScene />
      <div className="grain" />

      <nav className="site">
        <a className="brand" href="#top">
          <Logo />
          <span>
            Wayfinder <span className="os">OS</span>
          </span>
        </a>
        <div className="navcta">
          <a className="ghost" href="https://admin.wayfindercollective.io">
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
            <span className="kicker">
              <span className="dot" /> Now accepting founding operators
            </span>
            <h1>
              Everything orbits.
              <br />
              <span className="grad">Nothing leaves.</span>
            </h1>
            <p className="sub">
              The operating system for coaching companies. Ten tools, one core.
            </p>
            <a className="btn lg" href="#apply" style={{ alignSelf: "flex-start" }}>
              Apply for access →
            </a>
            <div className="scrollhint">
              <div className="mouse" /> Scroll — watch the chaos resolve
            </div>
          </section>

          {/* PROBLEM */}
          <section id="problem">
            <div className="center">
              <div className="eyebrow rv">The problem</div>
              <h2 className="title rv d1">
                Seven logins.
                <br />
                Nothing in the centre.
              </h2>
              <p className="lead rv d2">
                Spreadsheets for commissions. One tool for the dialer, another
                for email, a third for payments. Every system talks to every
                other system — badly. Data leaks, reports drift, and you&apos;re
                the one holding it together.
              </p>
              <div className="chips">
                {problems.map((p, i) => (
                  <div key={p} className={`chip jit rv d${(i % 3) + 2}`}>
                    <span className="x">✕</span> {p}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FIX */}
          <section id="collapse" style={{ minHeight: "96vh", display: "flex", alignItems: "center" }}>
            <div className="center" style={{ textAlign: "center", margin: "0 auto" }}>
              <div className="eyebrow rv">The fix</div>
              <h2 className="title rv d1">
                We pulled them all
                <br />
                <span className="grad">into one core.</span>
              </h2>
              <p className="lead rv d2" style={{ margin: "0 auto" }}>
                The tangle resolves. One database, one login, one source of
                truth — every tool now a facet of a single system. That&apos;s
                not a metaphor; it&apos;s the architecture.
              </p>
            </div>
          </section>

          {/* PLATFORM */}
          <section id="platform">
            <div className="center">
              <div className="eyebrow rv">The platform</div>
              <h2 className="title rv d1">One system. Every job.</h2>
              <p className="lead rv d2">
                Each module is native — not an integration, not a bolt-on. They
                share the same data the instant it changes.
              </p>
              <div className="bento">
                {featured.map((t, i) => (
                  <div key={t.key} className={`feature rv d${i + 1}`}>
                    <div className="ico">
                      <ToolIcon svg={t.svg} size={26} />
                    </div>
                    <h3>{t.title}</h3>
                    <p>{featuredDesc[t.key]}</p>
                    <div className="tags">
                      {featuredTags[t.key].map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid">
                {rest.map((t, i) => (
                  <div key={t.key} className={`card rv d${(i % 3) + 1}`}>
                    <div className="ico">
                      <ToolIcon svg={t.svg} />
                    </div>
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* STATS */}
          <section>
            <div className="center">
              <div className="stats">
                {stats.map((s, i) => (
                  <div key={s.lbl} className={`stat rv d${i + 1}`}>
                    <div className="num" data-to={s.to} data-suffix={s.suffix}>
                      0
                    </div>
                    <div className="lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* STORY */}
          <section id="story">
            <div className="center story">
              <div className="eyebrow rv">Why we built it</div>
              <h2 className="title rv d1">
                Built by operators who
                <br />
                <span className="grad">refused to settle.</span>
              </h2>
              <p className="lead rv d2" style={{ margin: "0 auto" }}>
                We ran a coaching company on five disconnected tools and
                commission spreadsheets we didn&apos;t trust. So we built the
                system we wished existed — then opened it to a handful of
                companies like yours.
              </p>
              <p className="quote rv d2">
                &ldquo;If your software can&apos;t tell you the truth about your
                business, it&apos;s costing you more than its price.&rdquo;
                <span className="by">— The Wayfinder team</span>
              </p>
            </div>
          </section>

          {/* WHY */}
          <section id="why">
            <div className="center">
              <div className="eyebrow rv">Why Wayfinder</div>
              <h2 className="title rv d1">
                GoHighLevel was built for agencies.
                <br />
                <span className="grad">This was built for coaching companies.</span>
              </h2>
              <div className="compare">
                <div className="col bad rv d1">
                  <h4>✕ What most settle for</h4>
                  <ul>
                    {settle.map((s) => (
                      <li key={s}>
                        <span className="m">·</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col good rv d2">
                  <h4>✓ The Wayfinder way</h4>
                  <ul>
                    {wayfinder.map((s) => (
                      <li key={s}>
                        <span className="m" style={{ color: "var(--cyan)" }}>
                          ✓
                        </span>{" "}
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* MIGRATION */}
          <section id="migration">
            <div className="center">
              <div className="eyebrow rv">The switch</div>
              <h2 className="title rv d1">Switch without the downtime.</h2>
              <p className="lead rv d2">
                Migrations are tooling-driven, run in parallel, and reversible
                until you&apos;re ready. No rushed cutover, no lost data.
              </p>
              <div className="steps">
                {steps.map((s, i) => (
                  <div key={s.h} className={`step rv d${i + 1}`}>
                    <div className="n">{i + 1}</div>
                    <h4>{s.h}</h4>
                    <p>{s.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <div className="center">
              <div className="eyebrow rv">Questions</div>
              <h2 className="title rv d1">Everything you&apos;re about to ask.</h2>
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

          {/* APPLY */}
          <section id="apply">
            <div className="apply rv">
              <div className="eyebrow">Founding access</div>
              <h2 className="title">
                Run your whole company
                <br />
                from one core.
              </h2>
              <p className="lead">
                We&apos;re onboarding a handful of coaching companies as founding
                operators — hands-on migration, direct support, and a voice in
                shaping the product. Apply and we&apos;ll book a call.
              </p>
              {/* TEMP: bypass the form while testing the animation — swap back to
                  className="btn lg apply-open" to re-enable the Apply form. */}
              <button className="btn lg warp-trigger" type="button" style={{ alignSelf: "center" }}>
                Apply for access →
              </button>
            </div>
          </section>

          <footer className="site">
            <span className="brand" style={{ fontSize: 16 }}>
              <Logo size={22} />
              <span>
                Wayfinder <span className="os">OS</span>
              </span>
            </span>
            <div>
              © 2026 Wayfinder Collective · The operating system for coaching
              companies.
            </div>
          </footer>
        </div>
      </div>

      <ApplyForm />
      <ClientFX />
    </>
  );
}
