import type { Viewport } from "next";

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
  // Root layout just passes through children.
  // The [locale] layout provides <html>, <head>, and <body> with locale-specific attributes.
  // This avoids nested <html> tags which cause hydration mismatches.
  return children;
}
