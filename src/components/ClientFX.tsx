"use client";

import { useEffect } from "react";

export default function ClientFX() {
  useEffect(() => {
    // Landing UTMs live on the homepage URL, but every CTA navigates to
    // /waitlist without a query string - so stash them for the form to pick up.
    // First-touch wins within a session: a later organic visit must not
    // overwrite the campaign that actually brought them here.
    try {
      const q = new URLSearchParams(location.search);
      const utm: Record<string, string> = {};
      for (const k of ["utm_source", "utm_medium", "utm_campaign"]) {
        const v = q.get(k);
        if (v) utm[k] = v;
      }
      if (Object.keys(utm).length && !sessionStorage.getItem("wf_utm")) {
        sessionStorage.setItem("wf_utm", JSON.stringify(utm));
      }
    } catch {
      // private modes can throw on sessionStorage - attribution is best-effort
    }

    // nav gets a hairline + backdrop once you've scrolled past the hero
    const nav = document.querySelector("nav.site");
    const onScroll = () => nav?.classList.toggle("solid", scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // mobile menu: the hamburger opens the nav links as a dropdown panel;
    // any link click or an outside tap closes it again
    const menuBtn = nav?.querySelector<HTMLButtonElement>(".menu-btn");
    const setMenu = (open: boolean) => {
      nav?.classList.toggle("open", open);
      menuBtn?.setAttribute("aria-expanded", String(open));
    };
    const onMenu = () => setMenu(!nav?.classList.contains("open"));
    const onNavClick = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest(".navlinks a")) setMenu(false);
    };
    const onDocClick = (e: Event) => {
      if (nav?.classList.contains("open") && !(e.target as HTMLElement).closest("nav.site"))
        setMenu(false);
    };
    menuBtn?.addEventListener("click", onMenu);
    nav?.addEventListener("click", onNavClick);
    document.addEventListener("click", onDocClick);

    // reveal on enter - a quiet fade/rise, nothing flashy
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.18 }
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));

    // migration steps reveal left-to-right as a set
    const seqIo = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            seqIo.unobserve(e.target);
          }
        }),
      { threshold: 0.3 }
    );
    document.querySelectorAll(".seq").forEach((el) => seqIo.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      menuBtn?.removeEventListener("click", onMenu);
      nav?.removeEventListener("click", onNavClick);
      document.removeEventListener("click", onDocClick);
      io.disconnect();
      seqIo.disconnect();
    };
  }, []);

  return null;
}
