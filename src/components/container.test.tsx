/**
 * Unit-Tests fuer die Container-Komponente.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./container";

describe("Container", () => {
  it("rendert als div mit max-width Klasse", () => {
    const { container } = render(<Container>Inhalt</Container>);
    expect(container.firstChild).toHaveClass("max-w-7xl");
  });

  it("unterstuetz custom tag via as-Prop", () => {
    render(<Container as="section" data-testid="sec">Inhalt</Container>);
    expect(screen.getByTestId("sec").tagName).toBe("SECTION");
  });

  it("merged className korrekt", () => {
    const { container } = render(<Container className="extra">Inhalt</Container>);
    expect(container.firstChild).toHaveClass("extra");
    expect(container.firstChild).toHaveClass("max-w-7xl");
  });
});
