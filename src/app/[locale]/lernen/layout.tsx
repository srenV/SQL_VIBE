import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lernen – SQL Theorie-Hub",
  description:
    "Theorie-Hub für Normalisierung, Relationenmodell, ERM, SQL-Grundlagen und mehr. Interaktive Artikel mit Diagrammen und eingebetteten Beispielen.",
  alternates: { canonical: "/lernen" },
  openGraph: {
    title: "Lernen – SQL Theorie-Hub",
    description:
      "Theorie-Hub für Normalisierung, Relationenmodell, ERM, SQL-Grundlagen und mehr. Interaktive Artikel mit Diagrammen und eingebetteten Beispielen.",
  },
};

export default function LernenLayout({ children }: { children: React.ReactNode }) {
  return children;
}