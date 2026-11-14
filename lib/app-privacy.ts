import type { Locale } from "@/lib/locale";
import { getBibibigEnglishPrivacy } from "@/lib/bibibig-english-privacy";
import { getSizeGoPrivacy } from "@/lib/sizego-privacy";
import { getWorldKitPrivacy } from "@/lib/worldkit-privacy";

export function getAppPrivacy(slug: string, locale: Locale) {
  if (slug === "sizego") return getSizeGoPrivacy(locale);
  if (slug === "worldkit") return getWorldKitPrivacy(locale);
  if (slug === "bibibig-english") return getBibibigEnglishPrivacy(locale);
  return null;
}
