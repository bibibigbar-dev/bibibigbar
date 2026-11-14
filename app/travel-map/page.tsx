import type { Metadata } from "next";
import { TravelMap } from "@/components/travel-map";
import { getRequestLocale } from "@/lib/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  if (locale === "ko") {
    return {
      title: "세계 여행 정보 지도",
      description:
        "세계지도에서 국가를 선택하고 한국 여권 기준 여행 준비 정보와 공식 입국 안내 사이트를 탐색하세요.",
    };
  }
  return {
    title: "World Travel Map",
    description:
      "Explore a world map, pick a country, and find travel prep notes and official entry guidance for Korean passport holders.",
  };
}

export default async function TravelMapPage() {
  const locale = await getRequestLocale();
  return <TravelMap initialLocale={locale} />;
}
