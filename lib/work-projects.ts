import type { Locale } from "@/lib/locale";

export interface WorkProject {
  slug: string;
  index: string;
  title: string;
  fullName: { en: string; ko: string };
  type: { en: string; ko: string };
  filter: { en: string; ko: string };
  year: string;
  role: { en: string; ko: string };
  stack: string;
  overview: { en: string; ko: string };
  cta?: { label: { en: string; ko: string }; href: string };
  heroImage?: string;
  screens?: string[];
  clickable?: boolean;
  privacyHref?: string;
}

export const workProjects: WorkProject[] = [
  {
    slug: "bibibigbar",
    index: "01",
    title: "BIBIBIGBAR",
    fullName: { en: "bibibigbar", ko: "bibibigbar" },
    type: { en: "Web · Next.js", ko: "웹 · Next.js" },
    filter: { en: "Web", ko: "웹" },
    year: "2026",
    role: { en: "Design & development", ko: "디자인 & 개발" },
    stack: "Next.js, Supabase",
    overview: {
      en: "A personal site for notes, travel tools, and the things I make.",
      ko: "기록과 여행 도구, 그리고 만들고 있는 것들을 모은 개인 사이트입니다.",
    },
    clickable: false,
  },
  {
    slug: "sizego",
    index: "02",
    title: "SIZEGO",
    fullName: { en: "SizeGo: Size Converter", ko: "SizeGo: Size Converter" },
    type: { en: "iOS / Android", ko: "iOS / Android" },
    filter: { en: "App", ko: "앱" },
    year: "2025",
    role: { en: "Design & development", ko: "디자인 & 개발" },
    stack: "iOS",
    overview: {
      en: "Convert KR ⇄ US clothing sizes in a few taps — for women, men, kids, and baby — then save the sizes you actually use.",
      ko: "여성·남성·키즈·베이비 KR ⇄ US 의류 사이즈를 몇 번의 탭으로 변환하고, 자주 쓰는 사이즈를 저장해 두는 앱입니다.",
    },
    cta: {
      label: { en: "App Store ↗", ko: "App Store ↗" },
      href: "https://apps.apple.com/us/app/sizego-size-converter/id6748774607?l=ko",
    },
    privacyHref: "/work/sizego/privacy",
    heroImage: "/work/sizego/hero.png",
    screens: [
      "/work/sizego/screen-01.png",
      "/work/sizego/screen-02.png",
      "/work/sizego/screen-03.png",
      "/work/sizego/screen-04.png",
    ],
  },
  {
    slug: "worldkit",
    index: "03",
    title: "WORLDKIT",
    fullName: { en: "WorldKit: Your Everyday Global Toolkit", ko: "WorldKit: Your Everyday Global Toolkit" },
    type: { en: "iOS / Android", ko: "iOS / Android" },
    filter: { en: "App", ko: "앱" },
    year: "2025",
    role: { en: "Design & development", ko: "디자인 & 개발" },
    stack: "iOS",
    overview: {
      en: "Currency, units, kitchen measures, tipping norms, and plug types — pick a country and every everyday travel tool adapts.",
      ko: "환율, 단위, 주방 계량, 팁 문화, 플러그 타입까지. 나라를 고르면 여행에 필요한 도구가 맞춰집니다.",
    },
    privacyHref: "/work/worldkit/privacy",
    heroImage: "/work/worldkit/hero.png",
    screens: [
      "/work/worldkit/screen-01.png",
      "/work/worldkit/screen-02.png",
      "/work/worldkit/screen-03.png",
      "/work/worldkit/screen-04.png",
      "/work/worldkit/screen-05.png",
      "/work/worldkit/screen-06.png",
    ],
  },
  {
    slug: "bibibig-english",
    index: "04",
    title: "BIBIBIG ENGLISH",
    fullName: { en: "Bibibig English", ko: "Bibibig English" },
    type: { en: "iOS / Android", ko: "iOS / Android" },
    filter: { en: "App", ko: "앱" },
    year: "2025",
    role: { en: "Design & development", ko: "디자인 & 개발" },
    stack: "Expo, React Native",
    overview: {
      en: "Everyday English for school, the doctor, and daycare — explained in your language, with reply helpers and call practice.",
      ko: "학교·병원·어린이집 일상 영어를 내 언어로 설명하고, 답장 도우미와 전화 연습까지 돕는 앱입니다.",
    },
    heroImage: "/work/bibibig-english/hero.png",
    screens: [
      "/work/bibibig-english/screen-01.png",
      "/work/bibibig-english/screen-02.png",
      "/work/bibibig-english/screen-03.png",
      "/work/bibibig-english/screen-04.png",
      "/work/bibibig-english/screen-05.png",
      "/work/bibibig-english/screen-06.png",
    ],
  },
  {
    slug: "travel-map",
    index: "05",
    title: "TRAVEL MAP",
    fullName: { en: "World Travel Map", ko: "세계 여행 정보 지도" },
    type: { en: "Web", ko: "웹" },
    filter: { en: "Web", ko: "웹" },
    year: "2026",
    role: { en: "Design & development", ko: "디자인 & 개발" },
    stack: "Next.js",
    overview: {
      en: "Pick a country on a world map and check entry prep notes for Korean passport holders.",
      ko: "세계지도에서 국가를 고르고, 한국 여권 기준 입국 준비 정보를 확인합니다.",
    },
    cta: { label: { en: "Open map ↗", ko: "지도 열기 ↗" }, href: "/travel-map" },
  },
];

export function getWorkProject(slug: string) {
  return workProjects.find((project) => project.slug === slug);
}

export function getWorkListItem(project: WorkProject, locale: Locale) {
  return {
    slug: project.slug,
    index: project.index,
    title: project.title,
    type: project.type[locale],
    filter: project.filter[locale],
    year: project.year,
    clickable: project.clickable !== false,
  };
}

export function getWorkDetailCopy(locale: Locale) {
  if (locale === "ko") {
    return {
      back: "← 전체 작업",
      role: "역할",
      stack: "스택",
      year: "연도",
      overview: "소개",
      next: "다음 프로젝트",
      screenshot: "스크린샷",
      mobile: "모바일 화면",
      privacy: "개인정보처리방침",
    };
  }
  return {
    back: "← All work",
    role: "Role",
    stack: "Stack",
    year: "Year",
    overview: "Overview",
    next: "Next project",
    screenshot: "screenshot",
    mobile: "mobile screen",
    privacy: "Privacy Policy",
  };
}
