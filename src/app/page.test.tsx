/**
 * Unit-Tests fuer die Home-Page.
 *
 * Testet das Rendern der Landing-Page:
 * - Ueberschrift, Start-Button, Lektionen-Link
 * - Statistiken und Funktionsweise-Sektion
 */

import React from "react";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

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

describe("Home Page", () => {
  it("rendert die Hauptueberschrift mit SQL", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("SQL");
  });

  it("rendert den Start-Button", () => {
    render(<Home />);
    const startElement = screen.getByText(/Jetzt üben|Jetzt starten/i);
    expect(startElement).toBeInTheDocument();
  });

  it("rendert den Lektionen-Button in der Navigation", () => {
    render(<Home />);
    const lektionenButtons = screen.getAllByText("Lektionen");
    expect(lektionenButtons.length).toBeGreaterThan(0);
  });

  it("zeigt Statistiken an (Uebungen)", () => {
    render(<Home />);
    expect(screen.getByText("Übungen")).toBeInTheDocument();
  });

  it("zeigt die Funktionsweise-Sektion", () => {
    render(<Home />);
    expect(screen.getByText(/Wie funktioniert/)).toBeInTheDocument();
  });
});