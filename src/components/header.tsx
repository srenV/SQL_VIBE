"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";

export interface HeaderProps {
  breadcrumbs?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function Header({
  breadcrumbs,
  rightSlot,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-surface-dim bg-surface/80 backdrop-blur-md supports-[backdrop-filter]:bg-surface/60 transition-colors duration-200"
    >
      <Container className="flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="shrink-0" aria-label="VIBAA Startseite">
            <Logo compact />
          </Link>
          {breadcrumbs && (
            <nav className="flex items-center gap-2 overflow-x-auto text-sm" aria-label="Breadcrumb">
              {breadcrumbs}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {rightSlot}
          <ThemeToggle />
          <Link href="/lektionen">
            <span className="inline-flex items-center justify-center h-9 px-3 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-dim transition-colors duration-150">
              Lektionen
            </span>
          </Link>
        </div>
      </Container>
    </header>
  );
}