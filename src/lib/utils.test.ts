/**
 * Unit-Tests fuer die Utility-Funktionen (cn, isNotEmpty).
 */
import { describe, it, expect } from "vitest";
import { cn, isNotEmpty } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("resolves Tailwind class conflicts", () => {
      expect(cn("px-2 px-4")).toBe("px-4");
    });

    it("ignores falsy classes", () => {
      expect(cn("foo", false && "bar", undefined, null, "baz")).toBe("foo baz");
    });

    it("handles conditional arrays", () => {
      const active = true;
      expect(cn("base", [active && "active", !active && "inactive"])).toBe("base active");
    });
  });

  describe("isNotEmpty", () => {
    it("returns true for non-empty strings", () => {
      expect(isNotEmpty("hello")).toBe(true);
      expect(isNotEmpty("  hello  ")).toBe(true);
    });

    it("returns false for empty strings", () => {
      expect(isNotEmpty("")).toBe(false);
      expect(isNotEmpty("   ")).toBe(false);
    });

    it("returns false for null and undefined", () => {
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });

    it("returns false for non-string types", () => {
      expect(isNotEmpty(42 as unknown as string)).toBe(false);
      expect(isNotEmpty({} as unknown as string)).toBe(false);
    });
  });
});
