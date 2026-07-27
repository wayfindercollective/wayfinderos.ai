// Small coded illustrations used instead of empty placeholder frames - each one
// is server-rendered JSX + CSS, no assets required. Real screenshots/photos can
// replace any of them later without touching layout (same .shot frames).

// The old way: a pile of sign-in screens. Generic tool names on purpose.
const LOGINS = [
  { name: "CRM", note: "Session expired" },
  { name: "Payments", note: "" },
  { name: "Calendar", note: "" },
  { name: "Email platform", note: "Reset your password?" },
  { name: "Dialer", note: "" },
  { name: "Spreadsheets", note: "3 unsaved changes" },
  { name: "Webchat", note: "" },
];

export function LoginPileup() {
  return (
    <div className="pileup" aria-label="Seven separate tool login screens, stacked on top of each other">
      {LOGINS.map((l, i) => (
        <div className="pileup-card" style={{ "--i": i } as React.CSSProperties} key={l.name}>
          <header>
            <span className="pu-dot" />
            {l.name}
          </header>
          <div className="pu-body">
            <span className="pu-field" />
            <span className="pu-field" />
            <span className="pu-btn">Sign in</span>
          </div>
          {l.note && <span className="pu-toast">{l.note}</span>}
        </div>
      ))}
    </div>
  );
}

// Static dashboard snapshot for the platform section's sticky column.
const SPARK = [42, 48, 45, 53, 58, 56, 63, 61, 68, 72, 70, 79];

export function DashboardShot() {
  const w = 320, h = 64, max = Math.max(...SPARK), min = Math.min(...SPARK);
  const pt = (v: number, i: number) =>
    `${(i / (SPARK.length - 1)) * w},${h - 5 - ((v - min) / (max - min)) * (h - 14)}`;
  const line = SPARK.map(pt).join(" ");
  return (
    <div className="dashshot" aria-label="The Wayfinder OS dashboard: collected this month, on schedule, overdue, and a rising collections chart">
      <header>
        <span className="pu-dot" />
        Dashboard
        <span className="dp-live"><i />live</span>
      </header>
      <div className="dp-stats">
        <div className="dp-stat hot"><em>Collected this month</em><strong>$85,500</strong></div>
        <div className="dp-stat"><em>On schedule</em><strong>$31,200</strong></div>
        <div className="dp-stat"><em>Overdue</em><strong>$0</strong></div>
      </div>
      <figure className="dp-spark">
        <figcaption>Collections · 12 weeks</figcaption>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
          <polyline points={line} fill="none" stroke="#22d3ee" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <polygon points={`0,${h} ${line} ${w},${h}`} fill="rgba(34,211,238,0.08)" stroke="none" />
        </svg>
      </figure>
      <ul className="ds-rows">
        <li><span>Commissions payable</span><strong>$3,802</strong></li>
        <li><span>Speed to lead (median)</span><strong>4m 12s</strong></li>
        <li><span>Calls reviewed by AI today</span><strong>23</strong></li>
      </ul>
    </div>
  );
}

// A live cohort call, as a simple call-grid mock.
const CALLERS = [
  { n: "Marcus J.", host: true },
  { n: "Sarah M." },
  { n: "Leo G." },
  { n: "Priya S." },
  { n: "Dan O." },
  { n: "Mia T." },
];

export function CallGridMock() {
  return (
    <div className="callgrid" aria-label="A live video call with six participants, recording on">
      <header>
        <span className="rec"><i />REC</span>
        <span>Momentum · Week 3 cohort call</span>
      </header>
      <div className="cg-tiles">
        {CALLERS.map((c) => (
          <div className={`cg-tile${c.host ? " host" : ""}`} key={c.n}>
            <span className="cg-avatar">{c.n[0]}</span>
            <em>{c.n}</em>
          </div>
        ))}
      </div>
      <footer>Attendance logged to each student&apos;s record. Recording shared after.</footer>
    </div>
  );
}
