import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Üben",
  robots: { index: false, follow: false },
};

/**
 * Alte Uebungs-Seite: leitet auf den Ueben-Hub (Lektionen) weiter.
 */
export default function UebungPage() {
  redirect("/lektionen");
}