import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sandbox – Create your own SQL database",
  description:
    "Create your own MySQL databases, set up tables, insert data, and run any SQL queries. Everything is stored locally in your browser.",
  alternates: { canonical: "/sandbox" },
  openGraph: {
    title: "Sandbox – Create your own SQL database",
    description:
      "Create your own MySQL databases, set up tables, insert data, and run any SQL queries. Everything is stored locally in your browser.",
  },
};

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return children;
}