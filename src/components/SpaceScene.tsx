"use client";

import { useEffect, useRef } from "react";
import { TOOLS, ARROW_POINTS } from "@/lib/tools";

export default function SpaceScene() {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const warpRef = useRef<HTMLCanvasElement>(null);
  const arrivedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = sceneRef.current!;
    const ctx = canvas.getContext("2d")!;
    const warp = warpRef.current!;
    const wctx = warp.getContext("2d")!;
    const arrived = arrivedRef.current!;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let W = 0,
      H = 0,
      DPR = 1;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const CY: [number, number, number] = [34, 211, 238];
    const WARN: [number, number, number] = [255, 86, 66];
    const mix = (
      a: [number, number, number],
      b: [number, number, number],
      t: number
    ): [number, number, number] => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
    const rgba = (c: [number, number, number], a: number) =>
      `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

    // ---- preload tinted icon images (cyan + red variants) ----
    const iconImg = (svg: string, color: string) => {
      const s = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>`;
      const img = new Image();
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
      return img;
    };

    type Node = {
      label: string;
      imgC: HTMLImageElement;
      imgR: HTMLImageElement;
      angle: number;
      radius: number;
      speed: number;
      tilt: number;
      phase: number;
      bob: number;
      w1: number;
      w2: number;
      w3: number;
      w4: number;
      dying: boolean;
      depth: number;
      px: number;
      py: number;
    };

    const nodes: Node[] = TOOLS.map((t, i) => ({
      label: t.label,
      imgC: iconImg(t.svg, "#bfeefb"),
      imgR: iconImg(t.svg, "#ff8a72"),
      angle: (i / TOOLS.length) * Math.PI * 2,
      radius: 0.3 + (i % 3) * 0.022,
      speed: 0.00006 + (i % 4) * 0.000013,
      tilt: 0.5 + (i % 5) * 0.045,
      phase: i * 0.7,
      bob: 0.5 + (i % 3) * 0.25,
      w1: 0.6 + (i % 3) * 0.5,
      w2: 0.8 + (i % 4) * 0.4,
      w3: 0.7 + (i % 5) * 0.3,
      w4: 0.9 + (i % 3) * 0.45,
      dying: i % 4 === 0,
      depth: 0,
      px: 0,
      py: 0,
    }));

    const rings = [
      { r: 0.3, tilt: 0.5, a: 0 },
      { r: 0.345, tilt: 0.46, a: 1.1 },
      { r: 0.39, tilt: 0.54, a: 2.2 },
    ];
    const stars = Array.from({ length: 170 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      tw: Math.random() * 6.28,
      sp: 0.4 + Math.random() * 0.8,
    }));
    const blobs: {
      x: number;
      y: number;
      r: number;
      c: [number, number, number];
      a: number;
      px: number;
      py: number;
      t: number;
    }[] = [
      { x: 0.72, y: 0.42, r: 0.5, c: [34, 211, 238], a: 0.16, px: 0.0008, py: 0.0006, t: 0 },
      { x: 0.3, y: 0.7, r: 0.45, c: [45, 212, 191], a: 0.08, px: 0.0006, py: 0.001, t: 2 },
      { x: 0.55, y: 0.15, r: 0.4, c: [56, 189, 248], a: 0.07, px: 0.0009, py: 0.0007, t: 4 },
    ];
    const pulses = nodes.map((_, i) => ({
      t: Math.random(),
      node: i,
      sp: 0.00018 + Math.random() * 0.00014,
    }));
    const debris = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: Math.random() * 2 + 0.6,
      ph: Math.random() * 6.28,
    }));

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let coreScreen = { x: innerWidth * 0.72, y: innerHeight * 0.44 };
    let coreR = 60,
      coreLogoSize = 40;
    let sy = 0,
      syT = 0;

    const A: { pTop?: number; pH?: number; cTop?: number; cH?: number } = {};
    function measure() {
      const p = document.getElementById("problem");
      const c = document.getElementById("collapse");
      if (!p || !c) return;
      A.pTop = p.getBoundingClientRect().top + scrollY;
      A.pH = p.offsetHeight;
      A.cTop = c.getBoundingClientRect().top + scrollY;
      A.cH = c.offsetHeight;
    }

    function resize() {
      DPR = Math.min(devicePixelRatio || 1, 2);
      W = canvas.width = innerWidth * DPR;
      H = canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      warp.width = innerWidth * DPR;
      warp.height = innerHeight * DPR;
      warp.style.width = innerWidth + "px";
      warp.style.height = innerHeight + "px";
      sCanvas.width = warp.width;
      sCanvas.height = warp.height;
      measure();
    }

    // arrow (from public/brand/logo.svg), centred on (cx,cy)
    // ax/ay = which point of the 120-box maps to (cx,cy).
    //  - display (orb logo): visual centre (60,65) so it sits centred in the orb
    //  - warp zoom: a point DEEP INSIDE the solid arrow (50,50) so the interior fills the screen
    function arrowPath(
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      ax = 50,
      ay = 50
    ) {
      const s = size / 120,
        ox = cx - ax * s,
        oy = cy - ay * s;
      c.beginPath();
      ARROW_POINTS.forEach((p, i) => {
        const x = ox + p[0] * s,
          y = oy + p[1] * s;
        if (i) c.lineTo(x, y);
        else c.moveTo(x, y);
      });
      c.closePath();
    }
    function strokeArrow(cx: number, cy: number, size: number, alpha: number) {
      if (alpha <= 0.01) return;
      // dark Wayfinder mark filled into the bright orb centre so it's clearly visible
      arrowPath(ctx, cx, cy, size, 60, 65);
      ctx.fillStyle = `rgba(6,16,24,${alpha})`;
      ctx.fill();
      ctx.lineWidth = Math.max(1.5, size * 0.03) * DPR;
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(6,16,24,${alpha})`;
      ctx.stroke();
    }

    /* ---------------- the main scene ---------------- */
    let t0 = performance.now();
    function frame(now: number) {
      const dt = Math.min(now - t0, 40);
      t0 = now;
      ctx.clearRect(0, 0, W, H);
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      sy += (syT - sy) * 0.08;
      const vh = innerHeight,
        cv = sy + vh * 0.5;

      let chaos = 0,
        collapse = 0;
      if (A.pTop !== undefined) {
        const pc = A.pTop + A.pH! * 0.5,
          cc = A.cTop! + A.cH! * 0.5,
          heroLeave = A.pTop - vh * 0.55;
        chaos = clamp((cv - heroLeave) / Math.max(1, pc - heroLeave));
        collapse = clamp((cv - pc) / Math.max(1, cc - pc));
      }
      const ce = ease(collapse),
        warn = chaos * (1 - collapse),
        pull = ce;

      const par = 28 * DPR;
      const cx = W * (0.72 + ce * 0.15) + mouse.x * par * 1.4,
        cy = H * 0.44 + mouse.y * par * 1.4;
      const minD = Math.min(W, H);
      coreScreen = { x: cx / DPR, y: cy / DPR };

      for (const b of blobs) {
        b.t += dt;
        const bx = (b.x + Math.sin(b.t * b.px) * 0.04) * W,
          by = (b.y + Math.cos(b.t * b.py) * 0.04) * H;
        const col = mix(b.c, WARN, warn * 0.75);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r * minD);
        g.addColorStop(0, rgba(col, b.a * (1 + ce * 0.5)));
        g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      for (const s of stars) {
        s.tw += 0.02 * s.sp;
        const a = 0.2 + Math.abs(Math.sin(s.tw)) * 0.5;
        ctx.beginPath();
        ctx.arc(s.x * W + mouse.x * par * 0.3, s.y * H + mouse.y * par * 0.3, s.r * DPR, 0, 7);
        ctx.fillStyle = `rgba(180,220,255,${a * 0.45})`;
        ctx.fill();
      }

      ctx.lineWidth = 1 * DPR;
      for (const rg of rings) {
        const rr = rg.r * minD * (1 - pull);
        ctx.beginPath();
        for (let a = 0; a <= 6.3; a += 0.12) {
          const x = cx + Math.cos(a + rg.a) * rr,
            y = cy + Math.sin(a + rg.a) * rr * rg.tilt;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rgba(CY, 0.1 * (1 - chaos) * (1 - pull));
        ctx.stroke();
      }

      const wcx = W * 0.74,
        wcy = H * 0.44;
      for (const n of nodes) {
        n.angle += n.speed * dt * (1 + warn * 1.5);
        const r = n.radius * minD;
        const ox = cx + Math.cos(n.angle) * r,
          oy = cy + Math.sin(n.angle) * r * n.tilt;
        const chx =
          wcx +
          Math.sin(now * 0.0012 * n.w1 + n.phase) * 0.14 * minD +
          Math.cos(now * 0.0019 * n.w2) * 0.06 * minD;
        const chy =
          wcy +
          Math.cos(now * 0.0014 * n.w3 + n.phase) * 0.13 * minD +
          Math.sin(now * 0.0021 * n.w4) * 0.05 * minD;
        let bx = ox + (chx - ox) * warn,
          by = oy + (chy - oy) * warn;
        if (n.dying) {
          bx += Math.cos(n.angle) * warn * 0.1 * minD;
          by += Math.sin(n.angle) * warn * 0.1 * minD;
        }
        const jx = warn * 11 * DPR * Math.sin(now * 0.009 * n.w1 + n.phase),
          jy = warn * 11 * DPR * Math.cos(now * 0.008 * n.w2 + n.phase);
        n.depth = (Math.sin(n.angle) + 1) / 2;
        bx += jx + mouse.x * par * (0.5 + n.depth);
        by += jy + mouse.y * par * (0.5 + n.depth);
        n.px = bx + (cx - bx) * pull;
        n.py = by + (cy - by) * pull;
      }
      const order = [...nodes].sort((a, b) => a.depth - b.depth);

      // chaos mesh — every tool wired to every other tool, red & flickering
      if (warn > 0.02) {
        for (let i = 0; i < nodes.length; i++)
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i],
              b = nodes[j],
              fl = 0.55 + 0.45 * Math.sin(now * 0.01 * (i + j + 1));
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.strokeStyle = rgba(WARN, warn * 0.13 * fl);
            ctx.lineWidth = 1.2 * DPR;
            ctx.stroke();
          }
        for (const d of debris) {
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          if (d.x < 0 || d.x > 1) d.vx *= -1;
          if (d.y < 0 || d.y > 1) d.vy *= -1;
          d.ph += 0.03;
          ctx.beginPath();
          ctx.arc(d.x * W, d.y * H, d.r * DPR, 0, 7);
          ctx.fillStyle = rgba(WARN, warn * (0.3 + 0.3 * Math.sin(d.ph)));
          ctx.fill();
        }
      }

      // clean connection lines + inward pulses (positive states)
      for (const n of order) {
        const la = (0.05 + n.depth * 0.11) * (1 - warn) * (1 - pull * 0.4);
        if (la <= 0.005) continue;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(n.px, n.py);
        ctx.strokeStyle = rgba(CY, la);
        ctx.lineWidth = (0.6 + n.depth * 0.9) * DPR;
        ctx.stroke();
      }
      for (const p of pulses) {
        p.t += p.sp * dt;
        if (p.t > 1) p.t -= 1;
        const n = nodes[p.node];
        const x = cx + (n.px - cx) * p.t,
          y = cy + (n.py - cy) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 1.9 * DPR, 0, 7);
        ctx.fillStyle = `rgba(125,240,255,${0.9 * (1 - Math.abs(p.t - 0.5) * 1.4) * (1 - warn)})`;
        ctx.shadowBlur = 10 * DPR;
        ctx.shadowColor = "#22d3ee";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // the core: soft sun in hero -> gone in chaos -> bright orb + logo at collapse
      const beat = 1 + Math.sin(now * 0.0016) * 0.06,
        coreStrength = clamp(0.55 * (1 - warn) + ce),
        cr = (40 + ce * 80) * DPR * beat;
      if (coreStrength > 0.01) {
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        cg.addColorStop(0, `rgba(255,255,255,${0.97 * coreStrength})`);
        cg.addColorStop(0.32, `rgba(125,240,255,${0.85 * coreStrength})`);
        cg.addColorStop(1, "rgba(34,211,238,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, 7);
        ctx.fillStyle = cg;
        ctx.shadowBlur = (50 + ce * 120) * DPR;
        ctx.shadowColor = "#22d3ee";
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(cx, cy, (28 + ce * 22) * DPR * beat, 0, 7);
        ctx.strokeStyle = `rgba(255,255,255,${0.5 * coreStrength})`;
        ctx.lineWidth = 1.2 * DPR;
        ctx.stroke();
      }
      strokeArrow(cx, cy, (52 + ce * 40) * DPR * beat, ce);
      coreR = cr;
      coreLogoSize = (52 + ce * 40) * DPR * beat;

      // nodes — real tool icons, tinted toward red in chaos, fading into the orb on collapse
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (const n of order) {
        const vis = (1 - pull) * (0.5 + n.depth * 0.5) * (n.dying ? 1 - warn * 0.85 : 1);
        if (vis <= 0.02) continue;
        const sc = 0.8 + n.depth * 0.5,
          r = 15 * DPR * sc,
          col = mix(CY, WARN, warn);
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, 7);
        ctx.fillStyle = rgba(col, vis * 0.16);
        ctx.shadowBlur = 16 * DPR;
        ctx.shadowColor = rgba(col, vis);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.1 * DPR;
        ctx.strokeStyle = rgba(col, vis * 0.7);
        ctx.stroke();
        const isz = 17 * DPR * sc;
        if (n.imgC.complete) {
          ctx.globalAlpha = vis * (1 - warn);
          ctx.drawImage(n.imgC, n.px - isz / 2, n.py - isz / 2, isz, isz);
        }
        if (n.imgR.complete && warn > 0.01) {
          ctx.globalAlpha = vis * warn;
          ctx.drawImage(n.imgR, n.px - isz / 2, n.py - isz / 2, isz, isz);
        }
        ctx.globalAlpha = 1;
        ctx.font = `600 ${11 * DPR * sc}px "Space Grotesk", ui-sans-serif, sans-serif`;
        ctx.fillStyle = rgba([230, 240, 248], vis * 0.9);
        ctx.fillText(n.label, n.px, n.py + r + 11 * DPR * sc);
      }
      ctx.textAlign = "left";

      raf = requestAnimationFrame(frame);
    }

    /* ---------------- hyperspace warp ---------------- */
    const sCanvas = document.createElement("canvas");
    const sctx = sCanvas.getContext("2d")!;
    const DOLLY = 1050,
      ZDUR = 2050,
      JUMP = 4900;
    let warpStars: { x: number; y: number; z: number }[] = [];
    let warpOn = false,
      warpRAF = 0,
      warpT0 = 0,
      warpCore = { x: 0, y: 0 },
      warpStartR = 60,
      warpStartLogo = 40;
    const cEl = () => document.querySelector(".content") as HTMLElement;

    function warpArrow(c: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
      arrowPath(c, cx, cy, size);
    }
    function warpOrb(ox: number, oy: number, R: number, a = 1) {
      const g = wctx.createRadialGradient(ox, oy, 0, ox, oy, R);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(0.28, `rgba(125,240,255,${0.95 * a})`);
      g.addColorStop(0.62, `rgba(34,211,238,${0.45 * a})`);
      g.addColorStop(1, "rgba(34,211,238,0)");
      wctx.fillStyle = g;
      wctx.beginPath();
      wctx.arc(ox, oy, R, 0, 7);
      wctx.fill();
    }

    function startWarp(e?: Event) {
      if (e) e.preventDefault();
      if (warpOn) return;
      warpOn = true;
      document.body.style.overflow = "hidden";
      if (reduce) {
        warp.classList.add("on");
        wctx.fillStyle = "#06080c";
        wctx.fillRect(0, 0, warp.width, warp.height);
        arrived.classList.add("on");
        return;
      }
      const wW = warp.width;
      const c = cEl();
      c.style.transition = `transform ${DOLLY}ms cubic-bezier(.5,0,.45,1)`;
      c.style.transform = "translateX(-115vw)";
      canvas.style.opacity = "0";
      warpStars = Array.from({ length: 560 }, () => ({
        x: (Math.random() - 0.5) * wW,
        y: (Math.random() - 0.5) * warp.height,
        z: Math.random() * wW,
      }));
      warpCore = { x: coreScreen.x * DPR, y: coreScreen.y * DPR };
      warpStartR = Math.max(coreR, 46 * DPR);
      warpStartLogo = Math.max(coreLogoSize, 60 * DPR);
      sctx.clearRect(0, 0, warp.width, warp.height);
      warp.classList.add("on");
      warpT0 = performance.now();
      cancelAnimationFrame(warpRAF);
      warpRAF = requestAnimationFrame(warpFrame);
      window.setTimeout(() => arrived.classList.add("on"), JUMP + 260);
    }

    function warpFrame(now: number) {
      const el = now - warpT0,
        wW = warp.width,
        wH = warp.height,
        cxx = wW / 2,
        cyy = wH / 2,
        maxDim = Math.max(wW, wH);
      if (el < DOLLY) {
        wctx.clearRect(0, 0, wW, wH);
        for (const s of warpStars) {
          const k = (160 * DPR) / s.z;
          wctx.fillStyle = `rgba(150,200,235,${0.14 * Math.min(1, k)})`;
          wctx.fillRect(cxx + s.x * k, cyy + s.y * k, 1.3 * DPR, 1.3 * DPR);
        }
        const q = el / DOLLY,
          c = ease(q);
        const ox = warpCore.x + (cxx - warpCore.x) * c,
          oy = warpCore.y + (cyy - warpCore.y) * c;
        warpOrb(ox, oy, warpStartR);
        warpArrow(wctx, ox, oy, warpStartLogo);
        wctx.fillStyle = "rgb(2,3,6)";
        wctx.fill();
      } else if (el < JUMP) {
        const ze = el - DOLLY,
          zp = clamp(ze / ZDUR);
        const sA = clamp((ze - ZDUR * 0.3) / (ZDUR * 0.7));
        sctx.fillStyle = "rgba(3,4,7,0.32)";
        sctx.fillRect(0, 0, wW, wH);
        if (sA > 0) {
          const he = ze - ZDUR * 0.3,
            speed = 2.2 + Math.pow(he / 1000, 2) * 46;
          for (const s of warpStars) {
            const pz = s.z;
            s.z -= speed;
            if (s.z < 1) {
              s.z = wW;
              s.x = (Math.random() - 0.5) * wW;
              s.y = (Math.random() - 0.5) * wH;
            }
            const k = (160 * DPR) / s.z,
              px = cxx + s.x * k,
              py = cyy + s.y * k,
              k0 = (160 * DPR) / pz,
              oxx = cxx + s.x * k0,
              oyy = cyy + s.y * k0;
            const a = Math.min(1, ((wW - s.z) / wW) * 1.5) * sA;
            sctx.strokeStyle = `rgba(${180 + a * 75},240,255,${a})`;
            sctx.lineWidth = Math.min(3.4, k) * DPR * 0.5;
            sctx.beginPath();
            sctx.moveTo(oxx, oyy);
            sctx.lineTo(px, py);
            sctx.stroke();
          }
        }
        const e = zp * zp * zp;
        // ONE proportional zoom factor for the whole orb+logo composite, so the logo
        // stays the same size relative to the orb the entire way in. Zmax is large enough
        // that the logo's interior eventually fills the screen.
        const Zmax = (maxDim * 18) / warpStartLogo;
        const Z = 1 + (Zmax - 1) * e;
        wctx.fillStyle = "rgb(4,6,10)";
        wctx.fillRect(0, 0, wW, wH);
        warpOrb(cxx, cyy, warpStartR * Z, 1 - zp * 0.7);
        // hyperspace is ONLY ever visible through the arrow cutout (never leaks outside).
        wctx.save();
        warpArrow(wctx, cxx, cyy, warpStartLogo * Z);
        wctx.clip();
        wctx.fillStyle = "rgb(2,3,6)";
        wctx.fillRect(0, 0, wW, wH);
        wctx.drawImage(sCanvas, 0, 0);
        wctx.restore();
        if (el > JUMP - 450) {
          const f = (el - (JUMP - 450)) / 450;
          wctx.fillStyle = `rgba(225,250,255,${Math.min(1, f) * 0.92})`;
          wctx.fillRect(0, 0, wW, wH);
        }
      } else {
        const a = Math.min(1, (el - JUMP) / 450);
        wctx.fillStyle = `rgba(6,12,18,${a})`;
        wctx.fillRect(0, 0, wW, wH);
        if (a >= 1) return;
      }
      if (warpOn) warpRAF = requestAnimationFrame(warpFrame);
    }

    function endWarp() {
      warpOn = false;
      cancelAnimationFrame(warpRAF);
      warp.classList.remove("on");
      arrived.classList.remove("on");
      const c = cEl();
      c.style.transition = "transform 500ms ease";
      c.style.transform = "";
      canvas.style.opacity = "1";
      document.body.style.overflow = "";
      wctx.clearRect(0, 0, warp.width, warp.height);
    }

    /* ---------------- wiring ---------------- */
    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / innerWidth - 0.5;
      mouse.ty = e.clientY / innerHeight - 0.5;
    };
    const onScroll = () => {
      syT = scrollY;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    const triggers = Array.from(document.querySelectorAll<HTMLElement>(".warp-trigger"));
    triggers.forEach((b) => b.addEventListener("click", startWarp));
    const onWarpEvent = () => startWarp();
    window.addEventListener("wf:warp", onWarpEvent);
    const backBtn = arrived.querySelector<HTMLButtonElement>(".back");
    backBtn?.addEventListener("click", endWarp);

    resize();
    setTimeout(measure, 400);
    let raf = requestAnimationFrame(frame);
    if (reduce) {
      cancelAnimationFrame(raf);
      // draw a single static hero frame
      frame(performance.now());
      cancelAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(warpRAF);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("wf:warp", onWarpEvent);
      triggers.forEach((b) => b.removeEventListener("click", startWarp));
      backBtn?.removeEventListener("click", endWarp);
      document.body.style.overflow = "";
    };
  }, []);

  const arrowD = "M" + ARROW_POINTS.map(([x, y]) => `${x} ${y}`).join("L") + "Z";

  return (
    <>
      <canvas id="scene" ref={sceneRef} />
      <canvas id="warp" ref={warpRef} />
      <div className="arrived" ref={arrivedRef}>
        <svg className="logo" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <path d={arrowD} stroke="currentColor" strokeWidth={7} strokeLinejoin="round" />
        </svg>
        <h2 className="grad">Welcome aboard.</h2>
        <p>
          Application received. We&apos;ll be in touch to book your call and
          start the jump.
        </p>
        <button className="btn lg back" type="button">
          Back to launch
        </button>
      </div>
    </>
  );
}
