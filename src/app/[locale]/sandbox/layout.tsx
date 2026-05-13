import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sandbox");
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/sandbox" },
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return children;
}