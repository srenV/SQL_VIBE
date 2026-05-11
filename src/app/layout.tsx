import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeScript } from "@/components/themeProvider";
import { Footer } from "@/components/footer";
import { IntroOverlay } from "@/components/introOverlay";
import { AchievementToastProvider } from "@/components/achievementToast";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../fonts/Inter-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Inter-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Inter-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Inter-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Inter-800.woff2", weight: "800", style: "normal" },
    { path: "../fonts/Inter-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://sql-vibe.vercel.app";
const SITE_NAME = "SQL VIBE";
const SITE_DESCRIPTION =
  "Interaktive MySQL-Lernplattform mit Übungen, freier Sandbox für eigene Datenbanken und Theorie-Hub für Normalisierung, RM, ERM und SQL-Grundlagen. MySQL-Syntax wird vollständig unterstützt.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SQL VIBE – Lerne MySQL: Üben, Experimentieren, Verstehen",
    template: "%s | SQL VIBE",
  },
  description: SITE_DESCRIPTION,
  keywords: [
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
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "SQL VIBE – Lerne MySQL: Üben, Experimentieren, Verstehen",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL VIBE – Lerne MySQL: Üben, Experimentieren, Verstehen",
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    /* TODO: apple-touch-icon — 180x180 PNG manuell erstellen und in public/ ablegen */
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              inLanguage: "de",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/lektionen`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AchievementToastProvider>
          <a href="#main-content" className="skip-nav">
            Zum Inhalt springen
          </a>
          <IntroOverlay />
          {children}
          <Footer />
        </AchievementToastProvider>
      </body>
    </html>
  );
}
