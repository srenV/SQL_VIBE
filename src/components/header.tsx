"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";

/** Haupt-Navigations-Tabs der Drei-Säulen-Architektur. */
const NAV_TABS = [
  {
    href: "/lektionen",
    label: "Üben",
    labelShort: "Üben",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    href: "/sandbox",
    label: "Sandbox",
    labelShort: "Sandbox",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    href: "/lernen",
    label: "Lernen",
    labelShort: "Lernen",
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

export function Header({
  breadcrumbs,
  rightSlot,
}: HeaderProps) {
  const pathname = usePathname();

  /** Prueft ob ein Tab aktiv ist (exakt oder Sub-Route). */
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/lektionen") {
      // Üben-Tab aktiv fuer /lektionen und /lektionen/* und /uebung
      return pathname.startsWith("/lektionen") || pathname.startsWith("/uebung");
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className="sticky top-0 z-40 border-b border-surface-dim bg-surface/80 backdrop-blur-md supports-backdrop-filter:bg-surface/60 transition-colors duration-200"
    >
      <Container className="flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="shrink-0" aria-label="SQL-Trainer Startseite">
            <Logo compact />
          </Link>
          {breadcrumbs && (
            <nav className="flex items-center gap-2 overflow-x-auto text-sm" aria-label="Breadcrumb">
              {breadcrumbs}
            </nav>
          )}
        </div>

        {/* Tab-Bar Navigation */}
        <nav className="flex items-center gap-1 rounded-lg bg-surface-dim/70 dark:bg-dark-dim/70 p-1" aria-label="Hauptnavigation">
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
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}