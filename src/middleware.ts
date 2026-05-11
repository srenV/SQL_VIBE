import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * i18n-Middleware.
 *
 * Erkennt das bevorzugte Locale aus dem Accept-Language-Header
 * und leitet auf den entsprechenden Pfad weiter.
 *
 * Bei Static Export (output: 'export') wird diese Middleware
 * nicht serverseitig ausgeführt — stattdessen generiert
 * generateStaticParams() alle Locale-Pfade.
 */
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next (Next.js internals)
  // - static files (images, fonts, etc.)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};