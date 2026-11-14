"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/locale";
import { getSiteCopy } from "@/lib/site-copy";

interface LocaleSwitchProps {
  locale: Locale;
}

const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax`;
}

export function LocaleSwitch({ locale }: LocaleSwitchProps) {
  const router = useRouter();
  const copy = getSiteCopy(locale).lang;

  function switchLocale(next: Locale) {
    if (next === locale) return;
    persistLocale(next);
    router.refresh();
  }

  return (
    <div className="locale-switch" role="group" aria-label={copy.aria}>
      <button type="button" className="locale-switch-btn" aria-pressed={locale === "ko"} onClick={() => switchLocale("ko")}>
        {copy.ko}
      </button>
      <button type="button" className="locale-switch-btn" aria-pressed={locale === "en"} onClick={() => switchLocale("en")}>
        {copy.en}
      </button>
    </div>
  );
}
