"use client";

// Interactive product walkthrough: one truthful workflow - a lead books, the
// payment collects, the commission calculates, the dashboard updates - rendered
// as a Wayfinder OS app shell. Auto-plays with a simulated cursor when scrolled
// into view; the moment the visitor's own pointer arrives, it's theirs to drive.
// All numbers tell one coherent story: Sarah Mitchell buys a $4,800 program on a
// 4 x $1,200 plan; $1,200 collects today; her closer earns 12% of it.

import { useEffect, useRef, useState } from "react";

type StageKey = "crm" | "payments" | "commissions" | "dashboard";

const STAGES: { key: StageKey; nav: string; caption: string }[] = [
  { key: "crm", nav: "CRM & pipeline", caption: "A lead books a call. The CRM already knows." },
  { key: "payments", nav: "Payments", caption: "She signs. The plan charges itself, on schedule." },
  { key: "commissions", nav: "Commissions", caption: "Her closer's cut calculates itself. No spreadsheet." },
  { key: "dashboard", nav: "Dashboard", caption: "And every number updates, everywhere, live." },
];

const STAGE_ICONS: Record<StageKey, string> = {
  crm: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  payments:
    '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  commissions:
    '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/>',
  dashboard:
    '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
};

function Ic({ svg }: { svg: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

/* ---------------- panels ---------------- */

function PanelCRM() {
  return (
    <div className="dp dp-crm">
      <div className="dp-cols">
        <div className="dp-col">
          <h5>New leads <span>3</span></h5>
          <div className="dp-card new">
            <strong>Sarah Mitchell</strong>
            <em>Discovery call · Thu 2:00 PM</em>
            <span className="dp-tag">just booked</span>
          </div>
          <div className="dp-card"><strong>Dan Okafor</strong><em>Webchat · replied 2m ago</em></div>
          <div className="dp-card"><strong>Priya Shah</strong><em>Form fill · needs first call</em></div>
        </div>
        <div className="dp-col">
          <h5>Call booked <span>2</span></h5>
          <div className="dp-card"><strong>Leo Grant</strong><em>Tomorrow · 10:30 AM</em></div>
          <div className="dp-card"><strong>Mia Torres</strong><em>Fri · 1:00 PM</em></div>
        </div>
        <div className="dp-col dim">
          <h5>Won <span>4</span></h5>
          <div className="dp-card"><strong>Jordan Lee</strong><em>Momentum · $4,800</em></div>
          <div className="dp-card"><strong>Ana Costa</strong><em>Foundations · $2,400</em></div>
        </div>
      </div>
    </div>
  );
}

function PanelPayments() {
  return (
    <div className="dp dp-pay">
      <header>
        <div>
          <strong>Sarah Mitchell</strong>
          <em>Momentum Program · $4,800 · 4 payments</em>
        </div>
        <span className="dp-status good">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
          On plan
        </span>
      </header>
      <ul className="dp-sched">
        <li className="paid">
          <span>Today</span><strong>$1,200</strong>
          <span className="dp-status good">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
            Paid
          </span>
        </li>
        <li><span>Aug 21</span><strong>$1,200</strong><span className="dp-status">Scheduled</span></li>
        <li><span>Sep 21</span><strong>$1,200</strong><span className="dp-status">Scheduled</span></li>
        <li><span>Oct 21</span><strong>$1,200</strong><span className="dp-status">Scheduled</span></li>
      </ul>
      <p className="dp-note">Card saved. Charges run themselves - you only hear about it if one fails.</p>
    </div>
  );
}

function PanelCommissions() {
  return (
    <div className="dp dp-comm">
      <table>
        <thead>
          <tr><th>Coach</th><th>Tier</th><th>Collected</th><th>Payout</th></tr>
        </thead>
        <tbody>
          <tr><td>Alex Rivera</td><td>Tier 1 · 10%</td><td>$9,400</td><td>$940</td></tr>
          <tr className="new">
            <td>Marcus James</td>
            <td>Tier 2 · 12%</td>
            <td>$12,800</td>
            <td>
              $1,536 <span className="dp-tag">+$144</span>
            </td>
          </tr>
          <tr><td>Nina Park</td><td>Tier 2 · 12%</td><td>$11,050</td><td>$1,326</td></tr>
        </tbody>
      </table>
      <p className="dp-note">Sarah&apos;s payment landed - Marcus&apos;s cut is already in. Tiers upgrade themselves.</p>
    </div>
  );
}

// Collections - a single rising series, so no legend; the line is the product's
// accent and only the endpoint is marked. The chart is ALIVE: it draws itself in
// when the panel appears, then keeps ticking upward - a new point lands every
// couple of seconds with an upward bias, and the window slides along.
const SPARK = [42, 48, 45, 53, 58, 56, 63, 61, 68, 72, 70, 79];

function PanelDashboard({ active }: { active: boolean }) {
  const [collected, setCollected] = useState(84300);
  const [points, setPoints] = useState(SPARK);
  const [drawn, setDrawn] = useState(false);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 900);
      setCollected(Math.round(84300 + 1200 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // draw-in, then live upward drift: mostly gains, the odd soft week, never a crash.
  // The panel mounts fresh each time its stage activates, so `drawn` starts false
  // and the line animates in from zero on every visit.
  useEffect(() => {
    if (!active || reduce) {
      const r = requestAnimationFrame(() => setDrawn(true));
      return () => cancelAnimationFrame(r);
    }
    const drawT = setTimeout(() => setDrawn(true), 60);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setPoints((p) => {
        const last = p[p.length - 1];
        const delta = step % 4 === 2 ? -2 - Math.random() * 2 : 3 + Math.random() * 6;
        return [...p.slice(1), Math.round(last + delta)];
      });
    }, 1800);
    return () => {
      clearTimeout(drawT);
      clearInterval(iv);
      setPoints(SPARK);
    };
  }, [active, reduce]);

  const w = 320, h = 72, max = Math.max(...points), min = Math.min(...points);
  const pt = (v: number, i: number) =>
    `${(i / (points.length - 1)) * w},${h - 6 - ((v - min) / (max - min || 1)) * (h - 16)}`;
  const line = points.map(pt).join(" ");
  const [lx, ly] = pt(points[points.length - 1], points.length - 1).split(",").map(Number);

  return (
    <div className="dp dp-dash">
      <div className="dp-stats">
        <div className="dp-stat hot">
          <em>Collected this month</em>
          <strong>${collected.toLocaleString("en-US")}</strong>
          <span className="dp-live"><i />live</span>
        </div>
        <div className="dp-stat"><em>On schedule</em><strong>$31,200</strong></div>
        <div className="dp-stat"><em>Overdue</em><strong>$0</strong></div>
      </div>
      <figure className="dp-spark" aria-label="Collections rising week over week, updating live">
        <figcaption>Collections · live</figcaption>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-hidden="true">
          <polygon className="dp-spark-fill" points={`0,${h} ${line} ${w},${h}`} fill="rgba(34,211,238,0.08)" stroke="none" />
          <polyline
            className={`dp-spark-line${drawn ? " drawn" : ""}`}
            points={line}
            fill="none"
            stroke="#22d3ee"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={100}
          />
          <circle className="dp-spark-dot" cx={lx} cy={ly} r={3.5} fill="#22d3ee" stroke="#101014" strokeWidth={2} />
        </svg>
      </figure>
    </div>
  );
}

/* ---------------- shell ---------------- */

export default function OSDemo() {
  const [stage, setStage] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [tookOver, setTookOver] = useState(false); // visitor's own pointer wins, permanently
  const [cursor, setCursor] = useState<{ x: number; y: number; click: boolean } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef(stage);
  const tookOverRef = useRef(tookOver);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);
  useEffect(() => {
    tookOverRef.current = tookOver;
  }, [tookOver]);

  // The tour only runs while the demo is actually on screen and the tab is
  // foregrounded - it used to keep cycling timers for the whole visit, even
  // scrolled far away or behind a hidden LiveEmbed.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = frameRef.current;
    if (!el) return;
    let intersecting = false;
    const sync = () => setOnScreen(intersecting && !document.hidden);
    const io = new IntersectionObserver(
      (es) => {
        intersecting = es.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const auto = onScreen && !tookOver;

  // the tour: glide the fake cursor to the next module, click, switch panels
  useEffect(() => {
    if (!auto) return;
    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => !cancelled && fn(), ms));

    const step = () => {
      if (cancelled || tookOverRef.current) return;
      const next = (stageRef.current + 1) % STAGES.length;
      const btn = navRefs.current[next];
      const frame = frameRef.current;
      if (btn && frame) {
        const b = btn.getBoundingClientRect(), f = frame.getBoundingClientRect();
        setCursor({ x: b.left - f.left + b.width * 0.72, y: b.top - f.top + b.height * 0.6, click: false });
        later(() => setCursor((c) => (c ? { ...c, click: true } : c)), 620);
        later(() => {
          setStage(next);
          setCursor((c) => (c ? { ...c, click: false } : c));
        }, 800);
      } else {
        setStage(next);
      }
      later(step, 4200);
    };
    later(step, 1600);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [auto]);

  // the visitor's own pointer ends the tour for good
  const takeOver = () => {
    if (!tookOverRef.current) {
      setTookOver(true);
      setCursor(null);
    }
  };

  return (
    <div className="os-demo rv d2">
      <div
        className="os-frame"
        ref={frameRef}
        onPointerDown={takeOver}
        onMouseMove={takeOver}
      >
        <div className="os-chrome" aria-hidden="true">
          <span className="os-dots"><i /><i /><i /></span>
          <span className="os-url">admin.wayfindercollective.io</span>
        </div>
        <div className="os-body">
          <aside className="os-side" aria-label="Demo modules">
            {STAGES.map((s, i) => (
              <button
                key={s.key}
                ref={(el) => { navRefs.current[i] = el; }}
                type="button"
                className={i === stage ? "on" : ""}
                aria-pressed={i === stage}
                onClick={() => { takeOver(); setStage(i); }}
              >
                <Ic svg={STAGE_ICONS[s.key]} />
                <span>{s.nav}</span>
              </button>
            ))}
            <div className="os-more">+ 10 more modules</div>
          </aside>
          <div className="os-main">
            <div className="os-panel" key={STAGES[stage].key}>
              {stage === 0 && <PanelCRM />}
              {stage === 1 && <PanelPayments />}
              {stage === 2 && <PanelCommissions />}
              {stage === 3 && <PanelDashboard active={onScreen} />}
            </div>
          </div>
        </div>
        {cursor && (
          <div
            className={`os-cursor${cursor.click ? " click" : ""}`}
            style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="rgba(244,244,245,0.95)" stroke="#09090b" strokeWidth={1.2}>
              <path d="M5 3l14 8-6.5 1.5L9 19z" />
            </svg>
          </div>
        )}
      </div>
      <div className="os-caption" aria-live="polite">
        <span className="os-step-dots" aria-hidden="true">
          {STAGES.map((s, i) => (
            <button key={s.key} type="button" tabIndex={-1} className={i === stage ? "on" : ""} onClick={() => { takeOver(); setStage(i); }} />
          ))}
        </span>
        <p>{STAGES[stage].caption}</p>
        <span className="os-note">Illustration of the live product</span>
      </div>
    </div>
  );
}
