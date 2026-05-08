/**
 * Lernmodul-Detailseite – Zeigt alle Artikel eines Lernmoduls an.
 *
 * English: Learning module detail page – Shows all articles of a learning module.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getModuleById, allModuleIds } from "@/data/learnContent";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { FadeIn } from "@/components/animations";

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export async function generateStaticParams() {
  return allModuleIds.map((id) => ({ moduleId: id }));
}

export default async function LearnModulePage({ params }: PageProps) {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) notFound();

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header
        breadcrumbs={
          <>
            <Link href="/lernen" className="text-ink-muted hover:text-ink transition-colors">
              Lernen
            </Link>
            <span className="text-ink-muted">/</span>
            <span className="text-sm font-medium text-ink">{mod.title}</span>
          </>
        }
      />

      <main className="flex-1 py-12">
        <Container className="space-y-10">
          <FadeIn delay={0}>
            <div className="space-y-3">
              <div className="text-3xl" aria-hidden="true">{mod.icon}</div>
              <h1 className="text-3xl font-bold tracking-tight text-ink">
                {mod.title}
              </h1>
              <p className="text-ink-muted max-w-2xl">
                {mod.description}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid gap-4">
              {mod.articles.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/lernen/${mod.id}/${article.id}`}
                  className="group block"
                >
                  <Card
                    variant="outlined"
                    className="p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xs font-medium">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-ink group-hover:text-primary-500 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-xs text-ink-muted mt-1">
                            {article.estimatedMinutes} Min. Lesezeit · {article.sections.length} Abschnitte
                          </p>
                        </div>
                      </div>
                      <span className="text-ink-muted text-sm shrink-0" aria-hidden="true">&rarr;</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </FadeIn>
        </Container>
      </main>
    </div>
  );
}