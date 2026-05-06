/**
 * Unit-Tests fuer die Button-Komponente.
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("rendert den Button-Text korrekt", () => {
    render(<Button>Klick mich</Button>);
    expect(screen.getByRole("button", { name: /Klick mich/ })).toBeInTheDocument();
  });

  it("zeigt den Loading-Spinner und ist disabled", () => {
    render(<Button isLoading>Speichern</Button>);
    const btn = screen.getByRole("button", { name: /Speichern/ });
    expect(btn).toBeDisabled();
    expect(btn.querySelector("span")).toBeInTheDocument();
  });

  it("ist disabled bei disabled-Prop", () => {
    render(<Button disabled>Inaktiv</Button>);
    expect(screen.getByRole("button", { name: /Inaktiv/ })).toBeDisabled();
  });

  it("ruft onClick bei Klick auf", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Aktion</Button>);
    fireEvent.click(screen.getByRole("button", { name: /Aktion/ }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("wendet korrekte Varianten-Klassen an", () => {
    const { rerender } = render(<Button variant="primary">P</Button>);
    expect(screen.getByRole("button", { name: "P" })).toHaveClass("bg-primary-600");

    rerender(<Button variant="secondary">S</Button>);
    expect(screen.getByRole("button", { name: "S" })).toHaveClass("bg-surface-dim");

    rerender(<Button variant="accent">A</Button>);
    expect(screen.getByRole("button", { name: "A" })).toHaveClass("bg-accent-500");

    rerender(<Button variant="ghost">G</Button>);
    expect(screen.getByRole("button", { name: "G" })).toHaveClass("bg-transparent");
  });

  it("wendet korrekte Groessen-Klassen an", () => {
    const { rerender } = render(<Button size="sm">S</Button>);
    expect(screen.getByRole("button", { name: "S" })).toHaveClass("px-3");

    rerender(<Button size="md">M</Button>);
    expect(screen.getByRole("button", { name: "M" })).toHaveClass("px-4");

    rerender(<Button size="lg">L</Button>);
    expect(screen.getByRole("button", { name: "L" })).toHaveClass("px-6");
  });

  it("verwendet korrekte default-Werte", () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole("button", { name: "Default" });
    expect(btn).toHaveClass("bg-primary-600", "px-4");
    expect(btn).not.toBeDisabled();
  });
});
