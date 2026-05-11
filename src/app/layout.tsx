import type { Viewport } from "next";
import localFont from "next/font/local";
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
    <html className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
