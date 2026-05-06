/**
 * Vitest-Setup-Datei.
 *
 * Laedt jest-dom Matcher und konfiguriert Mocks fuer Next.js-Font
 * und window.matchMedia fuer konsistente Testumgebungen.
 */
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

/** Mock fuer Next.js local fonts (Inter). */
vi.mock("next/font/local", () => ({
  default: () => ({
    variable: "--font-inter",
    className: "font-inter",
  }),
}));

/** Mock fuer window.matchMedia in jsdom-Umgebung. */
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
