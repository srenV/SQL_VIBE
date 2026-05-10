"use client";

import { useEffect, useState } from "react";
import { createTimeline, scrambleText, stagger } from "animejs";

const SESSION_KEY = "sqlvibe-intro";
const S = "#sql-intro-overlay";

const SCOPED_CSS = `
#sql-intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #05080f;
  cursor: pointer;
  user-select: none;
}
#sql-intro-overlay main {
  position: relative;
  width: 100%;
  max-width: 1000px;
  aspect-ratio: 16/9;
  backface-visibility: hidden;
}
.sql-slide {
  opacity: 0;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sql-slide .sql-row {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}
.sql-slide p {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  font-size: clamp(0.65rem, 1.6vw, 1.4rem);
  flex-shrink: 0;
  line-height: 1;
  margin: 0.5ch;
  white-space: nowrap;
}
`;

export function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (
      sessionStorage.getItem(SESSION_KEY) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }

    const dismiss = () => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tl: any = createTimeline({ loop: false, onComplete: dismiss });

    // ── Slide 1: features ──────────────────────────────────────────────
    tl.add(`${S} .sql-slide:nth-child(1)`, { opacity: 1 });

    tl.add(
      `${S} .sql-slide:nth-child(1) p`,
      {
        innerHTML: scrambleText({
          override: " ",
          from: "center",
          duration: 450,
          revealDelay: 200,
          cursor: "░▒▓",
          perturbation: 0.5,
        }),
      },
      stagger([0, 700], { grid: true, from: "center", ease: "out(3)", start: "<<+=100", reversed: true })
    );

    tl.add(
      `${S} .sql-slide:nth-child(1) p`,
      { scale: [0.8, 1] },
      stagger([0, 100], { grid: true, from: "center", ease: "out(3)", start: "<<", reversed: true })
    );

    tl.add(
      `${S} .sql-slide:nth-child(1) p`,
      {
        innerHTML: scrambleText({
          text: " ",
          override: false,
          from: "center",
          reversed: true,
          duration: 450,
          cursor: "░▒▓",
        }),
      },
      stagger([0, 500], { grid: true, from: "center", ease: "out(3)", start: "<+=350" })
    );

    tl.set(`${S} .sql-slide:nth-child(2)`, { opacity: 1 }, "<<");

    // ── Slide 2: SQL-VIBE blob ─────────────────────────────────────────
    tl.add(
      `${S} .sql-slide:nth-child(2) p`,
      {
        color: "#818cf8",
        scale: [1, 1.8],
        ease: "inOutExpo",
        duration: 1200,
        innerHTML: scrambleText({
          text: "SQL-VIBE",
          override: " ",
          from: "center",
          cursor: "░▒▓█",
          perturbation: 0.3,
          settleDuration: 350,
        }),
      },
      "-=100"
    );

    tl.add(
      `${S} .sql-slide:nth-child(2) p`,
      {
        scale: 2.2,
        ease: "inOutExpo",
        duration: 600,
        innerHTML: scrambleText({
          text: " ",
          chars: "#!%░▒▓_",
          override: false,
          duration: 600,
          ease: "out(2)",
          from: "center",
        }),
      },
      "<+=700"
    );

    tl.add(`${S}`, { background: "#0a0e1a", duration: 600 }, "<<");

    tl.init();

    return () => tl.pause();
  }, []);

  const skip = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div id="sql-intro-overlay" onClick={skip} aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />
      <main>

        

        {/* ── Slide 1: SQL feature labels ──────────────────────────── */}
        <div className="sql-slide">
          <div className="sql-row">
            <p style={{ color: "#818cf8" }}>PRIMARY KEY</p>
            <p style={{ color: "#2dd4bf" }}>FOREIGN KEY</p>
          </div>
          <div className="sql-row">
            <p style={{ color: "#a78bfa" }}>INNER JOIN</p>
            <p style={{ color: "#fbbf24" }}>LEFT JOIN</p>
            <p style={{ color: "#818cf8" }}>SUBQUERY</p>
          </div>
          <div className="sql-row">
            <p style={{ color: "#a3e635" }}>GROUP BY</p>
            <p style={{ color: "#f472b6" }}>HAVING</p>
            <p style={{ color: "#38bdf8" }}>LIMIT</p>
            <p style={{ color: "#fb923c" }}>WITH (CTE)</p>
          </div>
          <div className="sql-row">
            <p style={{ color: "#2dd4bf" }}>TRANSACTION</p>
            <p style={{ color: "#818cf8" }}>INDEX</p>
            <p style={{ color: "#a78bfa" }}>CONSTRAINT</p>
          </div>
          <div className="sql-row">
            <p style={{ color: "#fbbf24" }}>STORED PROC</p>
            <p style={{ color: "#a3e635" }}>TRIGGER</p>
          </div>
        </div>
        

        {/* ── Slide 2: SQL-VIBE outro ───────────────────────────────── */}
        <div className="sql-slide">
          <p style={{ fontSize: "clamp(1.5rem, 4vw, 3.5rem)" }}>SQL-VIBE</p>
        </div>

      </main>
    </div>
  );
}
