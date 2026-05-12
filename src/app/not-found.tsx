import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <main className="flex-1 flex items-center justify-center py-20">
        <Container className="text-center space-y-6 max-w-lg">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary-500">404</h1>
            <h2 className="text-2xl font-semibold text-ink">Page not found</h2>
          </div>
          <p className="text-ink-muted">
            The requested page does not exist or has been moved.
            Go back to the homepage or choose one of the following areas:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/de"
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
            >
              Homepage
            </Link>
            <Link
              href="/de/lektionen"
              className="inline-flex items-center justify-center rounded-lg border border-surface-dim px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-dim/50 transition-colors"
            >
              SQL Lessons
            </Link>
            <Link
              href="/de/lernen"
              className="inline-flex items-center justify-center rounded-lg border border-surface-dim px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-dim/50 transition-colors"
            >
              Learning Hub
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}