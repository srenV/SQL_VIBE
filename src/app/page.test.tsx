/**
 * Unit-Tests fuer die Home-Page.
 *
 * Testet das Rendern der Landing-Page:
 * - Ueberschrift, Start-Button, Drei-Saeulen-Karten
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

  it("rendert die Drei-Saeulen-Karten (Ueben, Sandbox, Lernen)", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /Üben/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sandbox" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lernen" })).toBeInTheDocument();
  });

  it("rendert den Sandbox-Button", () => {
    render(<Home />);
    expect(screen.getByText("Sandbox öffnen")).toBeInTheDocument();
  });
});