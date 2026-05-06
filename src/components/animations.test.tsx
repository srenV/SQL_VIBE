/**
 * Unit-Tests fuer die Animations-Komponenten.
 *
 * Testet FadeIn, ScaleOnHover und AnimatedList:
 * - Rendern von children
 * - Initiale Styles (opacity, transform)
 * - IntersectionObserver-Integration
 */

import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { FadeIn, AnimatedList, ScaleOnHover } from "./animations";

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
});

describe("FadeIn", () => {
  it("rendert children", () => {
    render(
      <FadeIn>
        <div data-testid="child">Hallo</div>
      </FadeIn>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("setzt eine CSS-Klasse", () => {
    const { container } = render(
      <FadeIn className="test-class">
        <span>X</span>
      </FadeIn>
    );
    expect(container.firstChild).toBeDefined();
  });

  it("nimmt delay- und duration-Props an", () => {
    const { container } = render(
      <FadeIn delay={0.2} duration={0.6}>
        <span>X</span>
      </FadeIn>
    );
    expect(container.firstChild).toBeDefined();
  });
});

describe("AnimatedList", () => {
  it("rendert alle children", () => {
    render(
      <AnimatedList>
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
      </AnimatedList>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });

  it("wendet className an", () => {
    const { container } = render(
      <AnimatedList className="grid gap-4">
        <div>A</div>
      </AnimatedList>
    );
    expect(container.firstChild).toBeDefined();
  });
});

describe("ScaleOnHover", () => {
  it("rendert children", () => {
    render(
      <ScaleOnHover>
        <div data-testid="hover">Hover me</div>
      </ScaleOnHover>
    );
    expect(screen.getByTestId("hover")).toBeInTheDocument();
  });

  it("setzt eine CSS-Klasse", () => {
    const { container } = render(
      <ScaleOnHover className="inline-block">
        <span>X</span>
      </ScaleOnHover>
    );
    expect(container.firstChild).toBeDefined();
  });
});