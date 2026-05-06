import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility zum bedingten Zusammenfuehren von Tailwind-Klassen.
 * Kombiniert clsx (bedingte Klassen) mit tailwind-merge
 * (Deduplizierung und Konfliktaufloesung).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Prueft, ob ein String nicht leer ist. */
export function isNotEmpty(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
