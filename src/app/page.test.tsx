/**
 * Unit-Tests fuer die Home-Page.
 *
 * Testet das Rendern der Landing-Page:
 * - Ueberschrift, Start-Button, Drei-Saeulen-Karten
 *
 * Note: The root page.tsx is now a redirect to /de.
 * These tests render the HomeContent client component directly with i18n context.
 */

import React from "react";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import deMessages from "../../messages/de.json";
import { HomeContent } from "@/components/homeContent";

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const landing = deMessages.landing as Record<string, string>;

function renderHome() {
  return render(
    <NextIntlClientProvider locale="de" messages={deMessages}>
      <HomeContent
        headline={landing.headline}
        subheadline={landing.subheadline}
        sectionTitle={landing.sectionTitle}
        sectionSubtitle={landing.sectionSubtitle}
        practiceTitle={landing.practiceTitle}
        practiceDescription={landing.practiceDescription}
        practiceCta={landing.practiceCta}
        storyTitle={landing.storyTitle}
        storyDescription={landing.storyDescription}
        storyCta={landing.storyCta}
        sandboxTitle={landing.sandboxTitle}
        sandboxDescription={landing.sandboxDescription}
        sandboxCta={landing.sandboxCta}
        learnTitle={landing.learnTitle}
        learnDescription={landing.learnDescription}
        learnCta={landing.learnCta}
      />
    </NextIntlClientProvider>
  );
}

describe("Home Page", () => {
  it("rendert die Hauptueberschrift mit SQL", () => {
    renderHome();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("SQL");
  });

  it("rendert den Start-Button", () => {
    renderHome();
    const sandboxLinks = screen.getAllByRole("link");
    expect(sandboxLinks.length).toBeGreaterThanOrEqual(3);
  });

  it("rendert die Drei-Saeulen-Karten (Ueben, Sandbox, Lernen)", () => {
    renderHome();
    expect(screen.getByRole("heading", { name: /Üben/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sandbox" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Lernen/ })).toBeInTheDocument();
  });

  it("rendert den Sandbox-Button", () => {
    renderHome();
    expect(screen.getByText(/Sandbox öffnen/)).toBeInTheDocument();
  });
});