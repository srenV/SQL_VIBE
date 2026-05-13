"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Container } from "@/components/container";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <main className="flex-1 flex items-center justify-center py-20">
        <Container className="text-center space-y-6 max-w-lg">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary-500">404</h1>
            <h2 className="text-2xl font-semibold text-ink">{t("pageNotFound")}</h2>
          </div>
          <p className="text-ink-muted">
            {t("pageNotFoundDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
            >
              {t("home")}
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}