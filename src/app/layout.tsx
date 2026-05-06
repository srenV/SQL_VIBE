import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeScript } from "@/components/themeProvider";
import { Footer } from "@/components/footer";
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
  title: "VIBAA – Lerne MySQL spielerisch",
  description:
    "Interaktive MySQL-Lernplattform mit Uebungen, Erklaerungen und Gamification-Funktionen.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
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
        <a href="#main-content" className="skip-nav">
          Zum Inhalt springen
        </a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
