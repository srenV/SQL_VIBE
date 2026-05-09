"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";

/** Haupt-Navigations-Tabs der Drei-Säulen-Architektur. */
const NAV_TABS = [
  {
    href: "/lektionen",
    label: "Üben",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    href: "/sandbox",
    label: "Sandbox",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    href: "/lernen",
    label: "Lernen",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
] as const;

export interface HeaderProps {
  breadcrumbs?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function Header({ breadcrumbs, rightSlot }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/lektionen") {
      return pathname.startsWith("/lektionen") || pathname.startsWith("/uebung");
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Circle reveal from hamburger button (top-right)
  const overlayVariants = {
    hidden: prefersReduced
      ? { opacity: 0 }
      : { clipPath: "circle(0% at calc(100% - 2.5rem) 2rem)" },
    visible: prefersReduced
      ? { opacity: 1, transition: { duration: 0.2 } }
      : {
          clipPath: "circle(160% at calc(100% - 2.5rem) 2rem)",
          transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
        },
    exit: prefersReduced
      ? { opacity: 0, transition: { duration: 0.15 } }
      : {
          clipPath: "circle(0% at calc(100% - 2.5rem) 2rem)",
          transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
        },
  };

  const getItemVariants = (i: number) => ({
    hidden: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, filter: "blur(16px)", y: 48, rotateX: -20 },
    visible: prefersReduced
      ? { opacity: 1, transition: { duration: 0.2 } }
      : {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          rotateX: 0,
          transition: {
            delay: 0.12 + i * 0.05,
            duration: 0.45,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
    exit: prefersReduced
      ? { opacity: 0, transition: { duration: 0.1 } }
      : {
          opacity: 0,
          filter: "blur(8px)",
          y: 20,
          transition: { duration: 0.2, ease: "easeIn" },
        },
  });

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-surface-dim bg-surface/80 backdrop-blur-md supports-backdrop-filter:bg-surface/60 transition-colors duration-200">
        <Container className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="shrink-0" aria-label="SQLVIBE Startseite">
              <Logo />
            </Link>
            {breadcrumbs && (
              <nav className="flex items-center gap-2 overflow-x-auto text-sm" aria-label="Breadcrumb">
                {breadcrumbs}
              </nav>
            )}
          </div>

          {/* Tab-Bar — Desktop only */}
          <nav className="hidden sm:flex items-center gap-1 rounded-lg bg-surface-dim/70 dark:bg-dark-dim/70 p-1" aria-label="Hauptnavigation">
            {NAV_TABS.map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-white text-ink shadow-sm dark:bg-dark-dim dark:text-ink"
                      : "text-ink-muted hover:text-ink"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {rightSlot}
            <span className="hidden sm:block">
              <ThemeToggle />
            </span>

            {/* Hamburger Button — Mobile only */}
            <button
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-dim/60 transition-colors duration-150"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="relative flex flex-col justify-between w-5 h-[14px]">
                <motion.span
                  className="block w-full h-0.5 bg-current rounded-full origin-center"
                  animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <motion.span
                  className="block w-full h-0.5 bg-current rounded-full"
                  animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
                <motion.span
                  className="block w-full h-0.5 bg-current rounded-full origin-center"
                  animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </span>
            </button>
          </div>
        </Container>
      </header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-50 flex flex-col sm:hidden bg-surface/85 dark:bg-[#080c18]/90 backdrop-blur-3xl"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            {/* Floating Gradient Orbs */}
            <div
              className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full bg-primary-500/15 blur-3xl pointer-events-none"
              style={{ animation: "float-a 9s ease-in-out infinite" }}
            />
            <div
              className="absolute bottom-[-40px] left-[-40px] w-64 h-64 rounded-full bg-accent-500/10 blur-3xl pointer-events-none"
              style={{ animation: "float-b 11s ease-in-out infinite" }}
            />

            {/* Header Row */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/10">
              <Link href="/" onClick={() => setIsOpen(false)} aria-label="SQLVIBE Startseite">
                <Logo />
              </Link>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-lg text-ink-muted hover:text-ink hover:bg-white/10 transition-colors duration-150"
                onClick={() => setIsOpen(false)}
                aria-label="Menü schließen"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav Items */}
            <nav
              className="relative z-10 flex flex-col justify-center flex-1 gap-3 px-5 py-8"
              style={{ perspective: "1000px" }}
              aria-label="Mobile Navigation"
            >
              {NAV_TABS.map((tab, i) => {
                const active = isActive(tab.href);
                return (
                  <motion.div
                    key={tab.href}
                    variants={getItemVariants(i)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div
                      whileHover={prefersReduced ? undefined : { scale: 1.02, x: 6 }}
                      whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <Link
                        href={tab.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-4 w-full px-5 rounded-2xl min-h-[72px] border transition-colors duration-150 ${
                          active
                            ? "bg-primary-500/15 border-primary-400/40 text-ink"
                            : "bg-white/5 border-white/10 text-ink-muted hover:text-ink hover:bg-white/10"
                        }`}
                      >
                        {active && (
                          <span className="w-1 h-8 bg-primary-400 rounded-full shrink-0" aria-hidden="true" />
                        )}
                        <span className={`shrink-0 [&_svg]:w-6 [&_svg]:h-6 ${active ? "text-primary-400" : ""}`}>
                          {tab.icon}
                        </span>
                        <span className="text-xl font-semibold flex-1">{tab.label}</span>
                        <svg
                          className={`w-5 h-5 shrink-0 ${active ? "text-primary-400" : "text-ink-muted"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    </motion.div>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom — Theme Toggle */}
            <motion.div
              className="relative z-10 flex justify-center pb-10 pt-4 border-t border-white/10"
              variants={getItemVariants(NAV_TABS.length)}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
