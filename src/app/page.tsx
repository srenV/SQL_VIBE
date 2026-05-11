import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Root page — redirects to the default locale.
 * For static export, this generates a redirect at build time.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}