import type { Locale } from "@/lib/locale";

export interface LocalizedText {
  en: string;
  ko: string;
}

export interface Country {
  code: string;
  flag: string;
  name: LocalizedText;
  region: LocalizedText;
  entry: LocalizedText;
  preparation: LocalizedText;
  official: { label: LocalizedText; url: string }[];
}

export interface ResolvedCountry {
  code: string;
  flag: string;
  name: string;
  nameEn: string;
  region: string;
  entry: string;
  preparation: string;
  official: { label: string; url: string }[];
}

export const countries: Country[] = [
  {
    code: "JPN",
    flag: "🇯🇵",
    name: { en: "Japan", ko: "일본" },
    region: { en: "Asia", ko: "아시아" },
    entry: {
      en: "Before departure, confirm short-stay tourist entry rules and allowed stay length for Korean passports.",
      ko: "한국 여권의 단기 관광 입국 조건과 체류 가능 기간을 출발 전 확인하세요.",
    },
    preparation: {
      en: "Check Visit Japan Web, customs declaration, and duty-free rules.",
      ko: "Visit Japan Web, 세관 신고, 면세 규정을 확인하세요.",
    },
    official: [{ label: { en: "Visit Japan Web", ko: "Visit Japan Web" }, url: "https://www.vjw.digital.go.jp/" }],
  },
  {
    code: "USA",
    flag: "🇺🇸",
    name: { en: "United States", ko: "미국" },
    region: { en: "North America", ko: "북미" },
    entry: {
      en: "Confirm whether you need ESTA or another visa for your trip.",
      ko: "ESTA 또는 적절한 비자 등 본인에게 해당하는 입국 자격을 확인하세요.",
    },
    preparation: {
      en: "ESTA approval is not the same as final admission at the border.",
      ko: "ESTA 승인과 최종 입국 허가는 다릅니다.",
    },
    official: [{ label: { en: "U.S. CBP ESTA", ko: "미국 CBP ESTA" }, url: "https://esta.cbp.dhs.gov/" }],
  },
  {
    code: "FRA",
    flag: "🇫🇷",
    name: { en: "France", ko: "프랑스" },
    region: { en: "Europe", ko: "유럽" },
    entry: {
      en: "Check Schengen short-stay rules and the latest entry procedures.",
      ko: "솅겐 단기 체류 규정과 최신 입국 절차를 확인하세요.",
    },
    preparation: {
      en: "Confirm EES / ETIAS status and current transport notices.",
      ko: "EES 및 ETIAS 시행 상태와 교통 운행 정보를 확인하세요.",
    },
    official: [{ label: { en: "EU Travel Info", ko: "EU 여행 정보" }, url: "https://travel-europe.europa.eu/" }],
  },
  {
    code: "THA",
    flag: "🇹🇭",
    name: { en: "Thailand", ko: "태국" },
    region: { en: "Asia", ko: "아시아" },
    entry: {
      en: "Visa-free stay length and entry requirements can change — check the latest notice.",
      ko: "무비자 체류기간과 입국 요건은 변경될 수 있어 최신 공지가 필요합니다.",
    },
    preparation: {
      en: "Confirm electronic arrival declaration and passport validity rules.",
      ko: "전자 입국 신고와 여권 조건을 확인하세요.",
    },
    official: [
      { label: { en: "Thailand electronic arrival", ko: "태국 전자 입국 신고" }, url: "https://tdac.immigration.go.th/" },
    ],
  },
  {
    code: "AUS",
    flag: "🇦🇺",
    name: { en: "Australia", ko: "호주" },
    region: { en: "Oceania", ko: "오세아니아" },
    entry: {
      en: "Korean passport holders should confirm the right pre-entry authorization for their travel purpose.",
      ko: "한국 여권 여행자는 여행 목적에 맞는 사전 입국 허가를 확인하세요.",
    },
    preparation: {
      en: "Apply for ETA if needed, and prepare for strict biosecurity and customs rules.",
      ko: "ETA 신청과 엄격한 검역·세관 신고를 확인하세요.",
    },
    official: [{ label: { en: "Australian Home Affairs", ko: "호주 내무부" }, url: "https://immi.homeaffairs.gov.au/" }],
  },
  {
    code: "TWN",
    flag: "🇹🇼",
    name: { en: "Taiwan", ko: "대만" },
    region: { en: "Asia", ko: "아시아" },
    entry: {
      en: "Confirm short-stay entry conditions and passport validity.",
      ko: "단기 체류 입국 조건과 여권 유효기간을 확인하세요.",
    },
    preparation: {
      en: "Check whether an online arrival card is required.",
      ko: "대만 온라인 입국 신고서 제출 요건을 확인하세요.",
    },
    official: [{ label: { en: "Taiwan arrival card", ko: "대만 입국 신고" }, url: "https://twac.immigration.gov.tw/" }],
  },
  {
    code: "SGP",
    flag: "🇸🇬",
    name: { en: "Singapore", ko: "싱가포르" },
    region: { en: "Asia", ko: "아시아" },
    entry: {
      en: "Confirm short-visit conditions for Korean passports.",
      ko: "한국 여권 기준 단기 방문 조건을 확인하세요.",
    },
    preparation: {
      en: "Submit the SG Arrival Card on time and check entry requirements.",
      ko: "SG Arrival Card 제출 시점과 요건을 확인하세요.",
    },
    official: [{ label: { en: "Singapore ICA", ko: "싱가포르 ICA" }, url: "https://www.ica.gov.sg/" }],
  },
  {
    code: "GBR",
    flag: "🇬🇧",
    name: { en: "United Kingdom", ko: "영국" },
    region: { en: "Europe", ko: "유럽" },
    entry: {
      en: "Confirm whether you need an ETA or a visa for your visit purpose.",
      ko: "방문 목적에 따른 ETA 또는 비자 필요 여부를 확인하세요.",
    },
    preparation: {
      en: "Check the official GOV.UK ETA guidance before you travel.",
      ko: "공식 GOV.UK 페이지에서 ETA 요건을 확인하세요.",
    },
    official: [
      {
        label: { en: "UK ETA", ko: "영국 ETA" },
        url: "https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta",
      },
    ],
  },
  {
    code: "NZL",
    flag: "🇳🇿",
    name: { en: "New Zealand", ko: "뉴질랜드" },
    region: { en: "Oceania", ko: "오세아니아" },
    entry: {
      en: "Confirm NZeTA and other visit authorization requirements.",
      ko: "NZeTA 등 방문 허가 조건을 확인하세요.",
    },
    preparation: {
      en: "Check IVL, arrival declaration, and biosecurity rules.",
      ko: "IVL, 입국 신고, 생물보안 규정을 확인하세요.",
    },
    official: [{ label: { en: "Immigration New Zealand", ko: "뉴질랜드 이민성" }, url: "https://www.immigration.govt.nz/" }],
  },
  {
    code: "CAN",
    flag: "🇨🇦",
    name: { en: "Canada", ko: "캐나다" },
    region: { en: "North America", ko: "북미" },
    entry: {
      en: "Confirm eTA or visa needs based on how you enter and your traveler status.",
      ko: "입국 수단과 여행자 신분에 따른 eTA 또는 비자 요건을 확인하세요.",
    },
    preparation: {
      en: "Air entry and land entry requirements can differ.",
      ko: "항공편 입국과 육로 입국의 요건이 다를 수 있습니다.",
    },
    official: [
      {
        label: { en: "Visit Canada", ko: "캐나다 이민부" },
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
      },
    ],
  },
];

export function resolveCountry(country: Country, locale: Locale): ResolvedCountry {
  return {
    code: country.code,
    flag: country.flag,
    name: country.name[locale],
    nameEn: country.name.en,
    region: country.region[locale],
    entry: country.entry[locale],
    preparation: country.preparation[locale],
    official: country.official.map((item) => ({ label: item.label[locale], url: item.url })),
  };
}

export function resolveCountries(locale: Locale): ResolvedCountry[] {
  return countries.map((country) => resolveCountry(country, locale));
}
