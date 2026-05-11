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

/** Mock fuer next-intl navigation (useRouter, usePathname, etc.). */
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    return require("react").createElement("a", props, children);
  },
  redirect: () => {},
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/de",
  getPathname: vi.fn(),
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
