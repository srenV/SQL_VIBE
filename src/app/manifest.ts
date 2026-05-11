import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SQL VIBE – Interaktiver MySQL-Trainer",
    short_name: "SQL VIBE",
    description:
      "Interaktive MySQL-Lernplattform mit Übungen, freier Sandbox und Theorie-Hub für Normalisierung, RM, ERM und SQL-Grundlagen.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#6366f1",
    lang: "de",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}