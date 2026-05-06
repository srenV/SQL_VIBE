/**
 * Unit-Tests fuer die Card-Komponente.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./card";

describe("Card", () => {
  it("rendert children", () => {
    render(<Card>Inhalt</Card>);
    expect(screen.getByText("Inhalt")).toBeInTheDocument();
  });

  it("hat Rolle region", () => {
    render(<Card>X</Card>);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("wendet default-Variante an", () => {
    const { container } = render(<Card>Y</Card>);
    expect(container.firstChild).toHaveClass("shadow-sm");
  });

  it("wendet flat-Variante an", () => {
    const { container } = render(<Card variant="flat">Y</Card>);
    expect(container.firstChild).not.toHaveClass("shadow-sm");
  });

  it("wendet outlined-Variante an", () => {
    const { container } = render(<Card variant="outlined">Y</Card>);
    expect(container.firstChild).toHaveClass("border-primary-200");
  });
});
