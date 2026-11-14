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
    privacyHref: "/work/bibibig-english/privacy",
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
  {
    slug: "snapbudget",
    index: "06",
    title: "SNAP BUDGET",
    fullName: { en: "Snap Budget", ko: "Snap Budget" },
    type: { en: "iOS / Android", ko: "iOS / Android" },
    filter: { en: "App", ko: "앱" },
    year: "2026",
    role: { en: "Design & development", ko: "디자인 & 개발" },
    stack: "React Native, Supabase",
    overview: {
      en: "A personal money app for income, spending, assets, and budgets — with receipt capture, Excel export, and subscription unlock.",
      ko: "수입·지출·자산·예산을 한곳에서 관리하는 개인 가계부 앱. 영수증 촬영, Excel보내기, 구독 해금까지 포함합니다.",
    },
  },
  {
    slug: "bigbid",
    index: "07",
    title: "BIGBID AI",
    fullName: { en: "bigbid AI", ko: "bigbid AI" },
    type: { en: "Web · App", ko: "웹 · 앱" },
    filter: { en: "Web", ko: "웹" },
    year: "2026",
    role: { en: "Design & development", ko: "디자인 & 개발" },
    stack: "AI, Next-ready landing, Expo app",
    overview: {
      en: "AI auction listing tools — photograph inventory and get titles, descriptions, MSRP estimates, bid suggestions, and HiBid-ready export.",
      ko: "재고 사진을 찍으면 AI가 제목·설명·시세·입찰 제안까지 만들어 주는 경매·리셀러용 리스팅 도구입니다.",
    },
    cta: { label: { en: "bigbidai.com ↗", ko: "bigbidai.com ↗" }, href: "https://bigbidai.com/" },
  },
  {
    slug: "yeosu-web",
    index: "08",
    title: "YEOSU WEB",
    fullName: { en: "Yeosu Web", ko: "여수 웹" },
    type: { en: "Web · Next.js", ko: "웹 · Next.js" },
    filter: { en: "Web", ko: "웹" },
    year: "",
    role: { en: "Design & development", ko: "디자인 & 개발" },
    stack: "Next.js, Supabase, OpenLayers",
    overview: {
      en: "A Yeosu-focused web project for offshore and local energy workflows — maps, guides, and admin content tools.",
      ko: "여수 해상·지역 에너지 업무를 위한 웹. 지도, 안내, 관리자 콘텐츠 도구를 포함합니다.",
    },
  },
  {
    slug: "localplatform",
    index: "09",
    title: "LOCAL PLATFORM",
    fullName: { en: "Local Platform", ko: "로컬 플랫폼" },
    type: { en: "Web · Console", ko: "웹 · 콘솔" },
    filter: { en: "Web", ko: "웹" },
    year: "",
    role: { en: "Design & development", ko: "디자인 & 개발" },
    stack: "Next.js, Supabase, Capacitor",
    overview: {
      en: "An organization console for villages and local operators — members, points, maps, and day-to-day ops in one place.",
      ko: "마을·지역 운영자를 위한 조직 콘솔. 회원, 포인트, 지도, 일상 운영을 한곳에서 다룹니다.",
    },
  },
  {
    slug: "rootfund",
    index: "10",
    title: "ROOTFUND",
    fullName: { en: "ROOTFUND / Root Energy", ko: "ROOTFUND / Root Energy" },
    type: { en: "App · Web", ko: "앱 · 웹" },
    filter: { en: "App", ko: "앱" },
    year: "",
    role: { en: "Senior full-stack · PM", ko: "시니어 풀스택 · PM" },
    stack: "React Native, Next.js, banking APIs",
    overview: {
      en: "Renewable-energy funding platform work — investor mobile app (RootFund) and corporate web (Root Energy), with public and banking integrations.",
      ko: "재생에너지 펀딩 플랫폼. 투자자 모바일(RootFund)과 기업 웹(Root Energy), 공공·금융 API 연동을 포함합니다.",
    },
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
