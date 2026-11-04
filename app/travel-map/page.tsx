import type { Metadata } from "next";
import { TravelMap } from "@/components/travel-map";

export const metadata: Metadata = {
  title: "세계 여행 정보 지도",
  description: "세계지도에서 국가를 선택하고 한국 여권 기준 여행 준비 정보와 공식 입국 안내 사이트를 탐색하세요.",
};
export default function TravelMapPage() {
  return <TravelMap />;
}
