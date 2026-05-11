import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeScript } from "@/components/themeProvider";
import { Footer } from "@/components/footer";
import { IntroOverlay } from "@/components/introOverlay";
import { AchievementToastProvider } from "@/components/achievementToast";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../fonts/Inter-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/Inter-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Inter-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Inter-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Inter-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Inter-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SQL-Trainer – Lerne MySQL: Üben, Experimentieren, Verstehen",
  description:
    "Interaktive MySQL-Lernplattform mit Übungen, freier Sandbox für eigene Datenbanken und Theorie-Hub für Normalisierung, RM, ERM und SQL-Grundlagen. MySQL-Syntax wird vollständig unterstützt.",
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
