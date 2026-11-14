import type { Locale } from "@/lib/locale";

export const travelMapCopy = {
  en: {
    kicker: "BIBIBIGBAR · TRAVEL GUIDE",
    titleLine: "World travel guide map",
    intro:
      "Pick a country to browse related blog posts and official guidance. Focused on ordinary tourism with a Korean passport.",
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
    posts: "Blog posts",
    postsEmpty: "No posts tagged with this country yet.",
    openPost: "Read",
    official: "Official sources",
    disclaimer:
      "Posts are linked by country destination. Official rules change often — always recheck sources before you book or depart.",
  },
  ko: {
    kicker: "BIBIBIGBAR · TRAVEL GUIDE",
    titleLine: "세계 여행 정보 지도",
    intro:
      "국가를 선택해 관련 블로그 글과 공식 안내 사이트를 확인하세요. 한국 여권의 일반 관광 여행을 중심으로 정리했습니다.",
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
    posts: "블로그 글",
    postsEmpty: "이 나라로 연결된 글이 아직 없습니다.",
    openPost: "읽기",
    official: "공식 정보",
    disclaimer:
      "글은 destination(나라명)으로 연결됩니다. 규정은 바뀔 수 있으니 예약·출발 전 공식 기관에서 다시 확인하세요.",
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
