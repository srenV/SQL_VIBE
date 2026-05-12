import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { PageShell } from "@/components/pageShell";
import { FadeIn } from "@/components/animations";
import { FeatureCard } from "@/components/featureCard";
import { routing } from "@/i18n/routing";
import { HomeContent } from "@/components/homeContent";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/" },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SQL VIBE",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description: t("description"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  return (
    <PageShell mainClassName="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent
        headline={t("headline", { highlight: t("headlineHighlight") })}
        headlineHighlight={t("headlineHighlight")}
        subheadline={t("subheadline")}
        sectionTitle={t("sectionTitle")}
        sectionSubtitle={t("sectionSubtitle")}
        practiceTitle={t("practiceTitle")}
        practiceDescription={t("practiceDescription")}
        practiceCta={t("practiceCta")}
        storyTitle={t("storyTitle")}
        storyDescription={t("storyDescription")}
        storyCta={t("storyCta")}
        sandboxTitle={t("sandboxTitle")}
        sandboxDescription={t("sandboxDescription")}
        sandboxCta={t("sandboxCta")}
        learnTitle={t("learnTitle")}
        learnDescription={t("learnDescription")}
        learnCta={t("learnCta")}
      />
    </PageShell>
  );
}
