import type { Locale } from "@/lib/locale";
import { getSizeGoPrivacy } from "@/lib/sizego-privacy";
import { getWorldKitPrivacy } from "@/lib/worldkit-privacy";

export function getAppPrivacy(slug: string, locale: Locale) {
  if (slug === "sizego") return getSizeGoPrivacy(locale);
  if (slug === "worldkit") return getWorldKitPrivacy(locale);
  return null;
}
