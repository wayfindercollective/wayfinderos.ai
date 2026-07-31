// Standalone waitlist page - every "Apply to try it free" CTA lands here.
// Server component (metadata lives here); the stepper is a client component and
// must sit inside <Suspense> because it reads UTM params via useSearchParams.

import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Brand";
import WaitlistStepper from "@/components/WaitlistStepper";
import { SPOTS_LEFT, PRIVACY_URL, TERMS_URL } from "@/lib/waitlist";

export const metadata: Metadata = {
  title: "Apply to try it free - Wayfinder OS",
  description:
    "Founders pass: ten coaching companies get Wayfinder OS free while we tailor it to them. Takes about two minutes to apply.",
};

const points = [
  {
    h: "No more spreadsheets",
    p: "Commissions, payments and reports calculate themselves, live.",
  },
  {
    h: "One login",
    p: "CRM, payments, calls, booking and commissions in one place.",
  },
  {
    h: "We move you across",
    p: "Hands-on migration, run side by side until you trust it.",
  },
];

export default function WaitlistPage() {
  return (
    <div className="wl-page">
      <nav className="wl-nav-bar" aria-label="Primary">
        <Link className="brand" href="/">
          <Logo size={28} />
          <span>
            Wayfinder <span className="os">OS</span>
          </span>
        </Link>
        <Link className="textlink" href="/">
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to home
        </Link>
      </nav>

      <main className="wl-main">
        <header className="wl-head">
          <div className="chip">
            <span className="chip-dot" aria-hidden="true" />
            Founders pass · {SPOTS_LEFT} spots left
          </div>
          <h1>Apply to try it free.</h1>
          <p>
            Ten coaching companies get Wayfinder OS free while we tailor it to
            them. Tell us where it hurts - it takes about two minutes, and the
            number is so we can call you back, not to spam you.
          </p>
        </header>

        <Suspense fallback={<div className="wl-card" aria-hidden="true" />}>
          <WaitlistStepper />
        </Suspense>

        {/* Consent notice at the point of collection. Opens in a new tab so a
            part-completed application isn't lost to a navigation. */}
        <p className="wl-consent">
          By applying you agree to our{" "}
          <a href={TERMS_URL} target="_blank" rel="noopener noreferrer">
            terms of service
          </a>{" "}
          and{" "}
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
            privacy policy
          </a>
          . We use your details to contact you about Wayfinder OS - nothing else.
        </p>

        <section className="wl-points" aria-label="What you get">
          {points.map((p) => (
            <div key={p.h}>
              <h3>{p.h}</h3>
              <p>{p.p}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="wl-foot">
        <span>© 2026 Wayfinder Collective. All rights reserved.</span>
        <span className="flegal">
          <a href={PRIVACY_URL}>Privacy policy</a>
          <a href={TERMS_URL}>Terms of service</a>
        </span>
      </footer>
    </div>
  );
}
