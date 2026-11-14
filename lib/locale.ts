export type Locale = "en" | "ko";

export const LOCALE_COOKIE = "bibibig_locale";
export const LOCALE_HEADER = "x-bibibig-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ko";
}

/** Prefer Korea by IP; otherwise use Accept-Language. */
export function inferLocale(countryCode: string | null | undefined, acceptLanguage: string | null | undefined): Locale {
  const country = (countryCode || "").toUpperCase();
  if (country === "KR") return "ko";

  const al = (acceptLanguage || "").toLowerCase();
  if (al.includes("ko")) return "ko";
  return "en";
}

export function resolveLocale(options: {
  cookie?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (isLocale(options.cookie)) return options.cookie;
  return inferLocale(options.country, options.acceptLanguage);
}
