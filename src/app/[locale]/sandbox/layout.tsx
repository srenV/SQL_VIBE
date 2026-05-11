import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sandbox – Eigene SQL-Datenbank erstellen",
  description:
    "Erstelle eigene MySQL-Datenbanken, lege Tabellen an, füge Daten ein und führe beliebige SQL-Abfragen aus. Alles wird lokal im Browser gespeichert.",
  alternates: { canonical: "/sandbox" },
  openGraph: {
    title: "Sandbox – Eigene SQL-Datenbank erstellen",
    description:
      "Erstelle eigene MySQL-Datenbanken, lege Tabellen an, füge Daten ein und führe beliebige SQL-Abfragen aus. Alles wird lokal im Browser gespeichert.",
  },
};

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return children;
}