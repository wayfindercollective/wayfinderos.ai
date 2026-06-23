"use client";

import { useEffect } from "react";

export default function ClientFX() {
  useEffect(() => {
    // nav solidify on scroll
    const nav = document.querySelector("nav.site");
    const onScroll = () => nav?.classList.toggle("solid", scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // reveal on enter
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

    // sequential reveal (migration steps: step -> arrow -> step -> arrow -> step)
    const seqIo = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            seqIo.unobserve(e.target);
          }
        }),
      { threshold: 0.35 }
    );
    document.querySelectorAll(".seq").forEach((el) => seqIo.observe(el));

    // count-up stats
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const to = Number(el.dataset.to);
          const suf = el.dataset.suffix || "";
          let start: number | null = null;
          const step = (t: number) => {
            start = start ?? t;
            const p = Math.min((t - start) / 1100, 1);
            el.textContent = Math.round(p * to) + suf;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        }),
      { threshold: 0.6 }
    );
    document.querySelectorAll<HTMLElement>("[data-to]").forEach((el) => cio.observe(el));

    // card + feature cursor spotlight
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".card, .feature"));
    const spots = cards.map((c) => {
      const handler = (e: MouseEvent) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      };
      c.addEventListener("mousemove", handler);
      return { c, handler };
    });

    // magnetic CTA buttons (fine pointer + motion allowed)
    const fine =
      window.matchMedia("(pointer:fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mags = fine
      ? Array.from(document.querySelectorAll<HTMLElement>(".btn")).map((b) => {
          const move = (e: MouseEvent) => {
            const r = b.getBoundingClientRect();
            const mx = e.clientX - (r.left + r.width / 2);
            const my = e.clientY - (r.top + r.height / 2);
            b.style.transform = `translate(${mx * 0.18}px, ${my * 0.3}px)`;
          };
          const leave = () => {
            b.style.transform = "";
          };
          b.addEventListener("mousemove", move);
          b.addEventListener("mouseleave", leave);
          return { b, move, leave };
        })
      : [];

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      seqIo.disconnect();
      cio.disconnect();
      spots.forEach(({ c, handler }) => c.removeEventListener("mousemove", handler));
      mags.forEach(({ b, move, leave }) => {
        b.removeEventListener("mousemove", move);
        b.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return null;
}
