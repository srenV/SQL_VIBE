/**
 * Unit-Tests fuer die Input-Komponente.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  it("rendert Label und Input", () => {
    render(<Input label="Name" placeholder="Max" />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max")).toBeInTheDocument();
  });

  it("zeigt Fehlertext bei error", () => {
    render(<Input label="Email" error helperText="Ungueltig" />);
    expect(screen.getByText("Ungueltig")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("nutzt custom id falls gegeben", () => {
    render(<Input label="Test" id="my-id" />);
    expect(screen.getByLabelText("Test")).toHaveAttribute("id", "my-id");
  });

  it("ist disabled bei disabled-Prop", () => {
    render(<Input label="X" disabled />);
    expect(screen.getByLabelText("X")).toBeDisabled();
  });
});
