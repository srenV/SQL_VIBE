/**
 * Unit-Tests fuer die Logo-Komponente.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./logo";

describe("Logo", () => {
  it("rendert den vollstaendigen Text", () => {
    render(<Logo />);
    expect(screen.getByText("IBAA")).toBeInTheDocument();
    expect(screen.getByText("V")).toHaveClass("text-primary-600");
  });

  it("zeigt nur V im Kompaktmodus", () => {
    render(<Logo compact />);
    expect(screen.getByText("V")).toBeInTheDocument();
    // In jsdom werden Tailwind-Klassen nicht als display:none ausgewertet,
    // daher pruefen wir stattdessen die Klasse des Spans.
    expect(screen.getByText("IBAA")).toHaveClass("hidden");
  });

  it("wendet custom className an", () => {
    const { container } = render(<Logo className="custom-logo" />);
    expect(container.querySelector("span")).toHaveClass("custom-logo");
  });
});
