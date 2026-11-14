import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, LOCALE_HEADER, resolveLocale, type Locale } from "@/lib/locale";

export async function getRequestLocale(): Promise<Locale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const fromHeader = headerStore.get(LOCALE_HEADER);
  if (fromHeader === "en" || fromHeader === "ko") return fromHeader;

  return resolveLocale({
    cookie: cookieStore.get(LOCALE_COOKIE)?.value,
    country: headerStore.get("x-vercel-ip-country") || headerStore.get("cf-ipcountry"),
    acceptLanguage: headerStore.get("accept-language"),
  });
}
