import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Lokalisierte Navigation-Helpers.
 *
 * Stellt `Link`, `redirect`, `useRouter`, `getPathname` bereit,
 * die automatisch das aktuelle Locale berücksichtigen.
 */
export const { Link, redirect, useRouter, usePathname, getPathname } = createNavigation(routing);