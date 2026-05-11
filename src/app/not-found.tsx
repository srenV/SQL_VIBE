import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <main className="flex-1 flex items-center justify-center py-20">
        <Container className="text-center space-y-6 max-w-lg">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary-500">404</h1>
            <h2 className="text-2xl font-semibold text-ink">Seite nicht gefunden</h2>
          </div>
          <p className="text-ink-muted">
            Die angeforderte Seite existiert nicht oder wurde verschoben.
            Gehe zurück zur Startseite oder wähle einen der folgenden Bereiche:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
            >
              Zur Startseite
            </Link>
            <Link
              href="/lektionen"
              className="inline-flex items-center justify-center rounded-lg border border-surface-dim px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-dim/50 transition-colors"
            >
              SQL Lektionen
            </Link>
            <Link
              href="/lernen"
              className="inline-flex items-center justify-center rounded-lg border border-surface-dim px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-dim/50 transition-colors"
            >
              Lern-Hub
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}