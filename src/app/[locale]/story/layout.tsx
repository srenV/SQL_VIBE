import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story – SQL-Kriminalfälle und Missionen",
  description:
    "Löse spannende SQL-Kriminalfälle und Missionen mit steigender Schwierigkeit. Narrative Abenteuer, bei denen jede Abfrage zählt.",
  alternates: { canonical: "/story" },
  openGraph: {
    title: "Story – SQL-Kriminalfälle und Missionen",
    description:
      "Löse spannende SQL-Kriminalfälle und Missionen mit steigender Schwierigkeit. Narrative Abenteuer, bei denen jede Abfrage zählt.",
  },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}