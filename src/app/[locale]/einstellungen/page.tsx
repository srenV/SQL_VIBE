import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/pageShell";
import { routing } from "@/i18n/routing";
import { SettingsPageClient } from "./SettingsPageClient";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell mainClassName="flex-1 py-8" containerClassName="max-w-lg mx-auto space-y-6">
      <SettingsPageClient />
    </PageShell>
  );
}