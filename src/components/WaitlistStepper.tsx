"use client";

// One-question-at-a-time waitlist form, functionally matched to the form on
// wayfindercollective.io/waitlist: same steps, validation, auto-advance selects,
// Enter-to-continue, progress bar and success copy. Submits to /api/waitlist.

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WAITLIST_STEPS, formatPhone, EMAIL_RE } from "@/lib/waitlist";

type Answers = Record<string, string>;
const EMPTY: Answers = Object.fromEntries(WAITLIST_STEPS.map((s) => [s.id, ""]));

export default function WaitlistStepper() {
  const params = useSearchParams();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  const step = WAITLIST_STEPS[i];
  const last = i === WAITLIST_STEPS.length - 1;
  const pct = ((i + 1) / WAITLIST_STEPS.length) * 100;

  // Move focus to the new step after each change. Select steps have no
  // #step-input, and their previously-focused option button has just been
  // unmounted - without this, focus is lost to <body> and keyboard/screen-reader
  // users are stranded mid-form.
  useEffect(() => {
    const t = setTimeout(() => {
      const target =
        document.querySelector<HTMLElement>("#step-input") ??
        document.querySelector<HTMLElement>(".wl-option");
      target?.focus({ preventScroll: true });
    }, 200);
    return () => clearTimeout(t);
  }, [i]);

  const setValue = (v: string) => {
    const value = step.id === "phone" ? formatPhone(v) : v;
    setAnswers((a) => ({ ...a, [step.id]: value }));
    setErr(null);
  };

  const validate = useCallback(() => {
    const v = answers[step.id] ?? "";
    if (step.required && !v.trim()) {
      setErr("This field is required");
      return false;
    }
    if (step.id === "email" && v && !EMAIL_RE.test(v)) {
      setErr("Please enter a valid email");
      return false;
    }
    if (step.id === "phone" && v && v.replace(/\D/g, "").length < 10) {
      setErr("Please enter a valid phone number");
      return false;
    }
    return true;
  }, [answers, step]);

  const goto = (n: number) => {
    setFading(true);
    setTimeout(() => {
      setI(n);
      setErr(null);
      setFading(false);
    }, 150);
  };

  const next = () => {
    if (!validate()) return;
    if (!last) goto(i + 1);
  };

  // UTMs come from this page's own query string, or from what the homepage
  // stashed before the visitor clicked through to here.
  const utm = (k: string) => {
    const direct = params.get(k);
    if (direct) return direct;
    try {
      return (JSON.parse(sessionStorage.getItem("wf_utm") || "{}") as Record<string, string>)[k] ?? "";
    } catch {
      return "";
    }
  };

  const submit = async () => {
    if (!validate() || busy) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: answers.fullName,
          email: answers.email,
          phone: answers.phone.replace(/\D/g, ""),
          businessName: answers.businessName,
          currentSoftware: answers.currentSoftware,
          monthlySpend: answers.monthlySpend,
          biggestFrustration: answers.biggestFrustration,
          desiredFeature: answers.desiredFeature,
          utm_source: utm("utm_source"),
          utm_medium: utm("utm_medium"),
          utm_campaign: utm("utm_campaign"),
          website: honeypot.current?.value || "", // honeypot - humans leave it empty
        }),
      });
      if (!res.ok) {
        // surface the server's verdict (rate limit, rejection) rather than a
        // generic failure the visitor can't act on
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setErr(body?.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setErr("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step.type !== "textarea") {
      e.preventDefault();
      if (last) submit();
      else next();
    }
  };

  const pick = (value: string) => {
    setAnswers((a) => ({ ...a, [step.id]: value }));
    setErr(null);
    setTimeout(() => {
      if (i < WAITLIST_STEPS.length - 1) goto(i + 1);
    }, 200);
  };

  if (done) {
    return (
      <div className="wl-card wl-done" role="status">
        <span className="wl-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2>You&apos;re on the list</h2>
        <p>
          We&apos;ll be in touch soon with next steps. Thanks for your interest
          in Wayfinder OS.
        </p>
        <p className="wl-subtle">Early members get to help shape the product.</p>
      </div>
    );
  }

  return (
    <div className="wl-card" id="waitlist-form">
      <div className="wl-progress">
        <div className="wl-count">
          <span>
            {String(i + 1).padStart(2, "0")} / {String(WAITLIST_STEPS.length).padStart(2, "0")}
          </span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="wl-bar" role="progressbar" aria-valuenow={i + 1} aria-valuemin={1} aria-valuemax={WAITLIST_STEPS.length} aria-label="Form progress">
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className={`wl-step${fading ? " fading" : ""}`} role="group" aria-labelledby="wl-question">
        {/* the question is the step's accessible name and is announced on change */}
        <label
          className="wl-question"
          id="wl-question"
          htmlFor={step.type === "select" ? undefined : "step-input"}
          aria-live="polite"
        >
          {step.question}
        </label>

        {step.type === "select" ? (
          <div className="wl-options" role="group" aria-label={step.question}>
            {step.options!.map((o) => (
              <button
                key={o.value}
                type="button"
                className={`wl-option${answers[step.id] === o.value ? " picked" : ""}`}
                onClick={() => pick(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        ) : step.type === "textarea" ? (
          <textarea
            id="step-input"
            className="wl-input"
            rows={4}
            placeholder={step.placeholder}
            value={answers[step.id]}
            onChange={(e) => setValue(e.target.value)}
            aria-invalid={err ? true : undefined}
            aria-describedby={err ? "wl-err" : undefined}
          />
        ) : (
          <input
            id="step-input"
            className="wl-input"
            type={step.type}
            inputMode={step.type === "tel" ? "tel" : step.type === "email" ? "email" : "text"}
            autoComplete={
              step.id === "fullName"
                ? "name"
                : step.id === "email"
                  ? "email"
                  : step.id === "phone"
                    ? "tel"
                    : step.id === "businessName"
                      ? "organization"
                      : "off"
            }
            placeholder={step.placeholder}
            value={answers[step.id]}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            required={step.required}
            aria-required={step.required || undefined}
            aria-invalid={err ? true : undefined}
            aria-describedby={err ? "wl-err" : undefined}
          />
        )}

        {/* honeypot: visually hidden, bots fill it, the API drops those */}
        <input
          ref={honeypot}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="wl-honeypot"
          aria-hidden="true"
        />

        <p className="wl-err" id="wl-err" role="status" aria-live="polite">
          {err ?? ""}
        </p>

        <div className="wl-nav">
          <button
            type="button"
            className={`wl-back${i === 0 ? " hidden" : ""}`}
            onClick={() => goto(i - 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
          </button>
          {step.type !== "select" && (
            <button
              type="button"
              className="btn wl-next"
              disabled={busy}
              onClick={last ? submit : next}
            >
              {busy ? "Submitting…" : last ? "Submit" : "Next"}
              {!busy && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </button>
          )}
        </div>

        {step.type !== "select" && step.type !== "textarea" && (
          <p className="wl-hint">
            Press <kbd>Enter</kbd> to continue
          </p>
        )}
      </div>
    </div>
  );
}
