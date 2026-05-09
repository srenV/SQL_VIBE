"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "sqlvibe-intro";
const EASE_STRONG: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ─── Particle canvas ────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  h: number; // hue: 239 (indigo) or 174 (teal)
}

function ParticleField({ fade }: { fade: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = 60;
    const LINK = 140;
    let rafId = 0;
    let pts: Particle[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      if (!canvas) return;
      pts = Array.from({ length: N }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 1.5 + Math.random() * 1.5,
        h: Math.random() < 0.65 ? 239 : 174,
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const alpha = (1 - dist / LINK) * 0.55;
            ctx.strokeStyle = `hsla(${pts[i].h}, 80%, 65%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // nodes
      ctx.shadowBlur = 8;
      for (const p of pts) {
        ctx.shadowColor = `hsla(${p.h}, 80%, 65%, 0.9)`;
        ctx.fillStyle = `hsla(${p.h}, 80%, 70%, 1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function tick() {
      if (!canvas) return;
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      draw();
      rafId = requestAnimationFrame(tick);
    }

    resize();
    init();
    tick();

    window.addEventListener("resize", () => { resize(); init(); });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", () => { resize(); init(); });
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      animate={{ opacity: fade ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    />
  );
}

// ─── Letter ─────────────────────────────────────────────────────────────────

interface LetterProps {
  ch: string;
  delay: number;
  color: "white" | "indigo";
  show: boolean;
  hide: boolean;
}

function Letter({ ch, delay, color, show, hide }: LetterProps) {
  const isIndigo = color === "indigo";
  return (
    <motion.span
      className="inline-block"
      style={isIndigo ? { textShadow: "0 0 40px rgba(129,140,248,0.8), 0 0 80px rgba(129,140,248,0.4)" } : undefined}
      initial={{ opacity: 0, y: 28, filter: "blur(20px)" }}
      animate={
        hide
          ? { opacity: 0, y: -16, filter: "blur(8px)" }
          : show
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 28, filter: "blur(20px)" }
      }
      transition={
        hide
          ? { duration: 0.26, ease: "easeIn" }
          : { delay, duration: 0.5, ease: EASE_OUT }
      }
    >
      {ch}
    </motion.span>
  );
}

// ─── IntroOverlay ────────────────────────────────────────────────────────────

export function IntroOverlay() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "done">("in");
  const [vh, setVh] = useState(0);

  const skip = useCallback(() => {
    setPhase("done");
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  useEffect(() => {
    setVh(window.innerHeight);
    if (reduce || sessionStorage.getItem(SESSION_KEY)) {
      setPhase("done");
      return;
    }
    const t1 = setTimeout(() => setPhase("hold"), 700);
    const t2 = setTimeout(() => setPhase("out"), 2100);
    const t3 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [reduce]);

  if (phase === "done") return null;

  const show = phase === "hold" || phase === "out";
  const out = phase === "out";
  const scanActive = phase === "hold";

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden cursor-pointer select-none"
      onClick={skip}
      aria-hidden="true"
    >
      {/* Background + radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(99,102,241,0.18) 0%, #0a0e1a 65%)",
          backgroundColor: "#0a0e1a",
        }}
      />

      {/* Particle canvas */}
      <ParticleField fade={out} />

      {/* Scan line — sweeps during hold */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(129,140,248,0.7) 30%, rgba(45,212,191,0.5) 70%, transparent 100%)",
          boxShadow: "0 0 12px 1px rgba(129,140,248,0.5)",
        }}
        initial={{ y: 0, opacity: 0 }}
        animate={
          scanActive
            ? { y: [0, vh], opacity: [0, 0.9, 0.9, 0] }
            : { opacity: 0 }
        }
        transition={
          scanActive
            ? { duration: 0.85, delay: 0.2, ease: "linear", times: [0, 0.05, 0.92, 1] }
            : { duration: 0 }
        }
      />

      {/* 3D panel fold — rendered before logo so logo stays on top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: "1400px" }}
      >
        {/* Top panel */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2"
          style={{
            backgroundColor: "#0a0e1a",
            transformOrigin: "center bottom",
            backfaceVisibility: "hidden",
          }}
          animate={out ? { rotateX: -92 } : { rotateX: 0 }}
          transition={{ duration: 0.68, ease: EASE_STRONG }}
        />
        {/* Bottom panel */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            backgroundColor: "#0a0e1a",
            transformOrigin: "center top",
            backfaceVisibility: "hidden",
          }}
          animate={out ? { rotateX: 92 } : { rotateX: 0 }}
          transition={{ duration: 0.73, delay: 0.05, ease: EASE_STRONG }}
        />
      </div>

      {/* Logo — rendered last so it sits above panels */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 pointer-events-none"
        animate={{ opacity: out ? 0 : 1 }}
        transition={{ duration: 0.26, ease: "easeIn" }}
      >
        {/* Wordmark */}
        <div className="flex items-baseline gap-0 text-[clamp(3rem,10vw,6rem)] font-bold leading-none tracking-tight">
          {/* SQL */}
          <span className="text-white">
            {"SQL".split("").map((ch, i) => (
              <Letter key={i} ch={ch} delay={0.05 + i * 0.07} color="white" show={show} hide={out} />
            ))}
          </span>
          {/* VIBE */}
          <span className="text-primary-400">
            {"VIBE".split("").map((ch, i) => (
              <Letter key={i} ch={ch} delay={0.26 + i * 0.07} color="indigo" show={show} hide={out} />
            ))}
          </span>
        </div>

        {/* Divider */}
        <motion.div
          className="w-[120px] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(129,140,248,0.7) 40%, rgba(45,212,191,0.5) 60%, transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={show ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: 0.55, duration: 0.4, ease: EASE_OUT }}
        />

        {/* Tagline */}
        <motion.p
          className="font-mono text-[11px] tracking-[0.35em] uppercase text-ink-muted/60"
          initial={{ opacity: 0, y: 8 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.65, duration: 0.4, ease: EASE_OUT }}
        >
          MySQL · Sandbox · Learn
        </motion.p>
      </motion.div>
    </div>
  );
}
