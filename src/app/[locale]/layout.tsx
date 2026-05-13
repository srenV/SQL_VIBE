import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import "@/app/globals.css";
import { ThemeScript } from "@/components/themeProvider";
import { Footer } from "@/components/footer";
import { IntroOverlay } from "@/components/introOverlay";
import { AchievementToastProvider } from "@/components/achievementToast";
import { routing } from "@/i18n/routing";

const inter = localFont({
  src: [
    { path: "../../fonts/Inter-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/Inter-500.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/Inter-600.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/Inter-700.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/Inter-800.woff2", weight: "800", style: "normal" },
    { path: "../../fonts/Inter-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://sql-vibe.vercel.app";
const SITE_NAME = "SQL VIBE";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "SQL VIBE – Learn MySQL: Practice, Experiment, Understand"
    : "SQL VIBE – Lerne MySQL: Üben, Experimentieren, Verstehen";

  const description = isEn
    ? "Interactive MySQL learning platform with exercises, a free sandbox for your own databases, and a theory hub for normalization, RM, ERM, and SQL fundamentals."
    : "Interaktive MySQL-Lernplattform mit Übungen, freier Sandbox für eigene Datenbanken und Theorie-Hub für Normalisierung, RM, ERM und SQL-Grundlagen. MySQL-Syntax wird vollständig unterstützt.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | SQL VIBE`,
    },
    description,
    keywords: isEn
      ? [
          "learn SQL",
          "MySQL",
          "SQL exercises",
          "SQL trainer",
          "SQL tutorial",
          "database learning",
          "SQL sandbox",
          "normalization",
          "ERM",
          "relational model",
          "SQL fundamentals",
          "JOIN",
          "SELECT",
        ]
      : [
          "SQL lernen",
          "MySQL",
          "SQL Übungen",
          "SQL Trainer",
          "SQL Tutorial",
          "Datenbank lernen",
          "SQL Sandbox",
          "Normalisierung",
          "ERM",
          "Relationenmodell",
          "SQL Grundlagen",
          "JOIN",
          "SELECT",
        ],
    authors: [{ name: "Sören Timo Voigt", url: "https://github.com/srenV" }],
    creator: "Sören Timo Voigt",
    publisher: "Sören Timo Voigt",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        de: `${SITE_URL}/de`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "de_DE",
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as "de" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              inLanguage: locale,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/${locale}/lektionen`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <AchievementToastProvider>
            <a href="#main-content" className="skip-nav">
              {locale === "en" ? "Skip to content" : "Zum Inhalt springen"}
            </a>
            <IntroOverlay />
            {children}
            <Footer />
          </AchievementToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}