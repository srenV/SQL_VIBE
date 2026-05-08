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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: "/sandbox",
    label: "Sandbox",
    labelShort: "Sandbox",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    href: "/lernen",
    label: "Lernen",
    labelShort: "Lernen",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-14.48 0a60.46 60.46 0 00-.491-6.347A48.627 48.627 0 0112 3.096a48.627 48.627 0 018.962 3.7m-2.48 0A48.627 48.627 0 0012 3.096a48.627 48.627 0 00-8.962 3.7m14.48 0v.008H7.482v-.008" />
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