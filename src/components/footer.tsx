import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-surface-dim dark:border-dark-dim py-6 text-center text-sm text-ink-muted">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>&copy; S&ouml;ren Timo Voigt 2025&ndash;2026</span>
        <Link href="https://srenv.vercel.app/impressum" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
          Impressum
        </Link>
        <Link href="https://srenv.vercel.app/legal" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
          Datenschutz
        </Link>
        <Link href="https://github.com/srenV" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
          GitHub
        </Link>
      </div>
    </footer>
  );
}