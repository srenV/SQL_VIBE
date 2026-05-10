"use client";

import React, { useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";

function subscribeToDarkMode(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("storage", callback);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", callback);
  };
}

function getIsDarkSnapshot() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}
function getServerSnapshot() { return false; }
function getMountedSnapshot() { return true; }
function getMountedServerSnapshot() { return false; }

const STARS = [
  { x: 8,  y: 7,  size: 1.5, delay: 0    },
  { x: 16, y: 16, size: 1.5, delay: 0.55 },
  { x: 28, y: 8,  size: 2,   delay: 1.1  },
  { x: 24, y: 19, size: 1.5, delay: 0.3  },
];

export function ThemeToggle() {
  const isDark   = useSyncExternalStore(subscribeToDarkMode, getIsDarkSnapshot, getServerSnapshot);
  const mounted  = useSyncExternalStore(subscribeToDarkMode, getMountedSnapshot, getMountedServerSnapshot);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    localStorage.setItem("sql-trainer-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }, []);

  if (!mounted) {
    return <div className="w-14 h-7 rounded-full bg-surface-dim border border-surface-dim" />;
  }

  return (
    <motion.button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      whileTap={{ scale: 0.9 }}
      className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-full"
    >
      {/* Track */}
      <motion.div
        className="relative overflow-hidden rounded-full"
        style={{ width: 56, height: 28 }}
        animate={{
          backgroundColor: isDark ? "#1e1b4b" : "#fef3c7",
          boxShadow: isDark
            ? "0 0 0 1.5px #312e81, 0 0 18px 3px rgba(99,102,241,0.35)"
            : "0 0 0 1.5px #fde68a, 0 0 18px 3px rgba(251,191,36,0.4)",
        }}
        whileHover={{
          boxShadow: isDark
            ? "0 0 0 1.5px #4338ca, 0 0 26px 6px rgba(99,102,241,0.5)"
            : "0 0 0 1.5px #fbbf24, 0 0 26px 6px rgba(251,191,36,0.55)",
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Aurora shimmer — dark only */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 25% 50%, rgba(139,92,246,0.3) 0%, transparent 65%)",
          }}
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.45 }}
        />

        {/* Stars — dark only */}
        {STARS.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
            animate={
              isDark
                ? { opacity: [0.15, 1, 0.15], scale: [0.7, 1.5, 0.7] }
                : { opacity: 0, scale: 0 }
            }
            transition={
              isDark
                ? { repeat: Infinity, duration: 2.4, delay: s.delay, ease: "easeInOut" }
                : { duration: 0.15 }
            }
          />
        ))}

        {/* Thumb */}
        <motion.div
          className="absolute top-[3px] rounded-full flex items-center justify-center overflow-hidden"
          style={{ width: 22, height: 22 }}
          animate={{
            x: isDark ? 3 : 31,
            backgroundColor: isDark ? "#c7d2fe" : "#f59e0b",
            boxShadow: isDark
              ? "0 2px 10px rgba(99,102,241,0.65), 0 0 4px rgba(139,92,246,0.4)"
              : "0 2px 10px rgba(251,191,36,0.75), 0 0 6px rgba(251,191,36,0.5)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.85 }}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, scale: 0.3, rotate: -50 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.3, rotate: 50 }}
                transition={{ duration: 0.2, ease: "backOut" }}
                className="relative flex items-center justify-center w-full h-full"
              >
                {/* Moon shape */}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                {/* Moon shine dot */}
                <motion.span
                  className="absolute w-1 h-1 rounded-full bg-indigo-300/60 pointer-events-none"
                  style={{ top: 4, left: 12 }}
                  animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.3, 0.8] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, scale: 0.3, rotate: 90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.3, rotate: -90 }}
                transition={{ duration: 0.2, ease: "backOut" }}
                className="flex items-center justify-center w-full h-full"
              >
                {/* Rotating sun (rays + circle together) */}
                <motion.svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1"     x2="12" y2="3" />
                  <line x1="12" y1="21"    x2="12" y2="23" />
                  <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1"     y1="12"    x2="3"     y2="12" />
                  <line x1="21"    y1="12"    x2="23"    y2="12" />
                  <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
                  <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
