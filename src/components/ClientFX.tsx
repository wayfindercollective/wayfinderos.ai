"use client";

import { useEffect } from "react";

export default function ClientFX() {
  useEffect(() => {
    // nav gets a hairline + backdrop once you've scrolled past the hero
    const nav = document.querySelector("nav.site");
    const onScroll = () => nav?.classList.toggle("solid", scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

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
      io.disconnect();
      seqIo.disconnect();
    };
  }, []);

  return null;
}
