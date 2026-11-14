import type { Locale } from "@/lib/locale";

export const travelMapCopy = {
  en: {
    kicker: "BIBIBIGBAR · TRAVEL GUIDE",
    titleLine: "World travel guide map",
    intro:
      "Pick a country to check entry prep notes and official guidance. Focused on ordinary tourism with a Korean passport.",
    searchLabel: "Search countries",
    searchPlaceholder: "Search countries (e.g. Japan)",
    regionLabel: "Filter by region",
    regions: ["All", "Asia", "Europe", "North America", "Oceania"] as const,
    mapHint: "Click a country on the map or choose one from the list below",
    mapAria: "Interactive world map for country selection",
    loading: "Loading world map...",
    loadError: "Couldn’t load the map · use the country list below",
    legendAvailable: "Available",
    legendSelected: "Selected",
    empty: "No countries match your search.",
    guideLabel: "COUNTRY GUIDE",
    entry: "01 — Entry",
    prep: "02 — Travel prep",
    official: "03 — Official sources",
    disclaimer:
      "This page is a short travel-prep summary, not live border or travel-advisory data. Rules change often — always recheck official sources before you book or depart.",
  },
  ko: {
    kicker: "BIBIBIGBAR · TRAVEL GUIDE",
    titleLine: "세계 여행 정보 지도",
    intro:
      "국가를 선택해 입국 준비 정보와 공식 안내 사이트를 확인하세요. 한국 여권의 일반 관광 여행을 중심으로 정리했습니다.",
    searchLabel: "국가 검색",
    searchPlaceholder: "국가 검색 (예: 일본)",
    regionLabel: "지역 필터",
    regions: ["전체", "아시아", "유럽", "북미", "오세아니아"] as const,
    mapHint: "지도의 국가를 클릭하거나 아래 목록에서 선택하세요",
    mapAria: "국가 선택이 가능한 세계 지도",
    loading: "세계지도를 불러오는 중...",
    loadError: "지도 불러오기 실패 · 아래 국가 목록을 이용하세요",
    legendAvailable: "정보 제공",
    legendSelected: "선택",
    empty: "검색 결과가 없습니다.",
    guideLabel: "COUNTRY GUIDE",
    entry: "01 — 입국 정보",
    prep: "02 — 여행 준비",
    official: "03 — 공식 정보 확인",
    disclaimer:
      "이 페이지는 여행 준비를 돕는 요약 안내이며 실시간 입국 심사·여행경보를 제공하지 않습니다. 규정은 수시로 바뀔 수 있으므로 예약·출발 전 반드시 공식 기관에서 최신 조건을 확인하세요.",
  },
} as const;

export function getTravelMapCopy(locale: Locale) {
  return travelMapCopy[locale];
}

/** Map UI region filter value to the shared English region key used in data. */
export function regionFilterKey(locale: Locale, label: string): string | "all" {
  if (locale === "en") {
    if (label === "All") return "all";
    return label;
  }
  const map: Record<string, string | "all"> = {
    전체: "all",
    아시아: "Asia",
    유럽: "Europe",
    북미: "North America",
    오세아니아: "Oceania",
  };
  return map[label] ?? "all";
}
