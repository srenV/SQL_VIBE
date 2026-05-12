import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

/**
 * Alte Uebungs-Seite: leitet auf den Ueben-Hub (Lektionen) weiter.
 * English: Old exercise page — redirects to the lessons hub.
 */
export default async function UebungPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/${locale}/lektionen`);
}