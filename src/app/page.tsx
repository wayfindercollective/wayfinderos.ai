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

const stats = [
  { to: 10, suffix: "+", lbl: "tools replaced" },
  { to: 20, suffix: "%", lbl: "saved on stack cost" },
  { to: 1, suffix: "", lbl: "source of truth" },
  { to: 0, suffix: "", lbl: "integrations to babysit" },
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
              <div className="grid">
                {TOOLS.map((t, i) => (
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
