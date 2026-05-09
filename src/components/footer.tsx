import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-surface-dim bg-surface-dim/40">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Top row: Brand + Navigation */}
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-lg font-bold tracking-tight text-ink">
              SQL<span className="text-primary-500">VIBE</span>
            </span>
            <span className="text-xs text-ink-muted">
              Interaktiv SQL lernen — vom Anfänger zum Profi.
            </span>
          </div>

          {/* Navigation columns */}
          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Plattform
              </span>
              <Link href="/lernen" className="text-ink-muted hover:text-primary-500 transition-colors">
                Lernen
              </Link>
              <Link href="/lektionen" className="text-ink-muted hover:text-primary-500 transition-colors">
                Üben
              </Link>
              <Link href="/sandbox" className="text-ink-muted hover:text-primary-500 transition-colors">
                Sandbox
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Rechtliches
              </span>
              <Link
                href="https://srenv.vercel.app/impressum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-primary-500 transition-colors"
              >
                Impressum
              </Link>
              <Link
                href="https://srenv.vercel.app/legal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-primary-500 transition-colors"
              >
                Datenschutz
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-surface-dim" />

        {/* Bottom row: Copyright + GitHub */}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <span className="text-xs text-ink-muted">
            © {new Date().getFullYear()}{" "}S&ouml;ren Timo Voigt
          </span>
          <Link
            href="https://github.com/srenV"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.342-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}