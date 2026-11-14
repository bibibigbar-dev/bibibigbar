import { countries } from "@/lib/travel/countries";

/** Canonical English country names used on the travel map. */
export function travelCountryNames() {
  return countries.map((country) => country.name.en);
}

export function countryMatchKeys(code: string) {
  const country = countries.find((item) => item.code === code);
  if (!country) return [];
  return [country.code, country.name.en, country.name.ko].map((value) => value.trim().toLowerCase());
}

export function postMatchesCountry(destination: string, code: string) {
  const value = destination.trim().toLowerCase();
  if (!value) return false;
  return countryMatchKeys(code).includes(value);
}

const titleCountryRules: { pattern: RegExp; country: string }[] = [
  { pattern: /\bThailand\b/i, country: "Thailand" },
  { pattern: /\bJapan\b/i, country: "Japan" },
  { pattern: /\b(?:United Kingdom|\bUK\b|ETA Enforcement)\b/i, country: "United Kingdom" },
  { pattern: /\b(?:United States|\bU\.S\.\b|\bESTA\b|Global Entry|REAL ID|\bTSA\b)\b/i, country: "United States" },
  { pattern: /\bAustralia\b/i, country: "Australia" },
  { pattern: /\bTaiwan\b/i, country: "Taiwan" },
  { pattern: /\bSingapore\b/i, country: "Singapore" },
  { pattern: /\bFrance\b/i, country: "France" },
  { pattern: /\bCanada\b/i, country: "Canada" },
  { pattern: /\bNew Zealand\b/i, country: "New Zealand" },
];

export function inferCountryFromTitle(title: string) {
  for (const rule of titleCountryRules) {
    if (rule.pattern.test(title)) return rule.country;
  }
  return "";
}

export function normalizeCountryDestination(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  const matched = countries.find(
    (country) =>
      country.code.toLowerCase() === lower ||
      country.name.en.toLowerCase() === lower ||
      country.name.ko.toLowerCase() === lower,
  );
  return matched ? matched.name.en : trimmed.slice(0, 80);
}
