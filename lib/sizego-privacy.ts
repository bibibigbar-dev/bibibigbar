import type { Locale } from "@/lib/locale";

interface PrivacySection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: { title: string; bullets?: string[]; paragraphs?: string[] }[];
  table?: { headers: string[]; rows: string[][] };
}

interface PrivacyDoc {
  title: string;
  updated: string;
  effective: string;
  intro: string[];
  sections: PrivacySection[];
  back: string;
  button: string;
  kicker: string;
}

const en: PrivacyDoc = {
  title: "Privacy Policy",
  kicker: "SIZEGO",
  updated: "Last updated January 15, 2025",
  effective: "Effective Date: 01.15.2025",
  back: "← Back to SizeGo",
  button: "Privacy Policy",
  intro: [
    'SizeGo ("we", "our", or "us") provides a size comparison and conversion app for clothing and apparel across different brands and countries ("App"). This Privacy Policy explains how we collect, use, and protect your information when you use our App.',
    'This Privacy Notice for bluetree ("we," "us," or "our") also describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you download and use SizeGo.',
  ],
  sections: [
    {
      title: "1. Information We Do Not Collect",
      paragraphs: ["We respect your privacy. Our app is designed to collect minimal personal information. Specifically:"],
      bullets: [
        "No account or login is required for basic functionality",
        "We do not store your size preferences or personal measurements on any server",
        "User inputs (size selections, brand preferences, comparison searches) are used only on your device for size conversions",
        "We do not track your clothing purchases or shopping behavior",
      ],
    },
    {
      title: "2. Information We May Collect",
      paragraphs: ["Although we avoid unnecessary data collection, we may process the following:"],
      subsections: [
        {
          title: "a. Device Information",
          bullets: [
            "App version, device type, operating system (iOS/Android version)",
            "Device performance metrics for app optimization",
            "Used only for improving user experience and crash reports",
          ],
        },
        {
          title: "b. App Usage Data",
          bullets: [
            "Size chart lookups and brand searches (anonymized)",
            "Feature usage patterns to improve size conversion accuracy",
            "Category and product type selections for app optimization",
          ],
        },
        {
          title: "c. Advertising Data",
          bullets: [
            "Through Google AdMob, we may collect anonymized ad interaction data",
            "Subject to Google's AdMob Privacy Policy",
          ],
        },
        {
          title: "d. Payment Information",
          bullets: [
            "All purchases are processed securely via App Store In-App Purchase and Google Play In-App Billing",
            "We do not store or process your credit card or billing data",
            "Payment processing is subject to Apple App Store and Google Play privacy policies",
          ],
        },
        {
          title: "e. Optional Analytics Data",
          bullets: [
            "App usage statistics (anonymized)",
            "Size conversion success rates to improve accuracy",
            "Crash reports and error logs for debugging",
          ],
        },
      ],
    },
    {
      title: "3. How We Use Your Information",
      bullets: [
        "To provide size comparison and conversion functionality",
        "To maintain and update size chart databases",
        "To process payments and provide access to premium features",
        "To display relevant ads via AdMob",
        "To improve app performance and understand usage trends (anonymized)",
        "To provide customer support and troubleshooting",
      ],
    },
    {
      title: "4. Data Security",
      bullets: [
        "We do not permanently store your size preferences or personal measurements",
        "All size comparisons are processed locally on your device",
        "Size chart data is stored in a secure Supabase database with encryption",
        "Payment and advertising services are handled by third-party providers with industry-standard security",
      ],
    },
    {
      title: "5. Third-Party Services",
      paragraphs: ["We use the following third-party providers:"],
      table: {
        headers: ["Service", "Purpose", "Policy"],
        rows: [
          ["Supabase", "Size chart database", "https://supabase.com/privacy"],
          ["Google AdMob", "In-app advertising", "https://policies.google.com/technologies/ads"],
          ["Apple In-App Purchase", "Payment processing (iOS)", "https://www.apple.com/legal/privacy/"],
          ["Google Play In-App Billing", "Payment processing (Android)", "https://policies.google.com/privacy"],
          ["Google Analytics", "App analytics", "https://policies.google.com/privacy"],
        ],
      },
    },
    {
      title: "6. Your Choices",
      bullets: [
        "You may use the App without providing any personal information",
        "You may opt out of personalized ads via your device settings",
        "You can disable analytics tracking in app settings",
        "Premium features can be purchased without creating an account",
      ],
    },
    {
      title: "7. Review, Update, or Delete Your Data",
      paragraphs: [
        "Depending on applicable law, you may have the right to request access to, correct, or delete personal information we hold about you, or withdraw consent to processing.",
        "To request review, update, or deletion, visit raniii.com/contact or email support@raniii.com.",
        'For account deletion, email support@raniii.com with the subject "Delete My Account". We will verify your identity and delete eligible data within 7 days, except where retention is required by law (for example App Store or Google Play payment history).',
      ],
    },
    {
      title: "8. Contact Us",
      paragraphs: [
        "If you have questions or concerns about this Privacy Policy, contact our Data Protection Officer:",
        "Email: support@raniii.com",
        "Phone: 469-240-9176",
        "bluetree · Data Protection Officer",
      ],
    },
    {
      title: "9. Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. Any changes will be posted within the App and/or on this website. The updated version will be indicated by an updated date at the top of this notice.",
      ],
    },
  ],
};

const ko: PrivacyDoc = {
  title: "개인정보처리방침",
  kicker: "SIZEGO",
  updated: "최종 업데이트: 2025년 1월 15일",
  effective: "시행일: 2025.01.15",
  back: "← SizeGo로 돌아가기",
  button: "개인정보처리방침",
  intro: [
    'SizeGo("우리", "당사")는 브랜드·국가별 의류 사이즈 비교·변환 앱("앱")을 제공합니다. 본 개인정보처리방침은 앱 이용 시 정보를 어떻게 수집·이용·보호하는지 설명합니다.',
    "bluetree의 본 고지는 SizeGo를 다운로드·이용할 때 개인정보를 어떻게 처리하는지도 함께 안내합니다.",
  ],
  sections: [
    {
      title: "1. 수집하지 않는 정보",
      paragraphs: ["당사는 개인정보 수집을 최소화합니다. 구체적으로:"],
      bullets: [
        "기본 기능에는 계정·로그인이 필요하지 않습니다",
        "사이즈 선호·신체 치수를 서버에 저장하지 않습니다",
        "사이즈 선택·브랜드 선호·검색 입력은 기기 내에서만 변환에 사용됩니다",
        "의류 구매나 쇼핑 행동을 추적하지 않습니다",
      ],
    },
    {
      title: "2. 수집할 수 있는 정보",
      paragraphs: ["불필요한 수집은 피하지만, 다음 정보는 처리할 수 있습니다."],
      subsections: [
        {
          title: "a. 기기 정보",
          bullets: [
            "앱 버전, 기기 종류, OS(iOS/Android)",
            "앱 최적화를 위한 성능 지표",
            "사용자 경험 개선 및 크래시 리포트에만 사용",
          ],
        },
        {
          title: "b. 앱 이용 데이터",
          bullets: [
            "사이즈표 조회·브랜드 검색(익명화)",
            "변환 정확도 개선을 위한 기능 사용 패턴",
            "카테고리·상품 유형 선택(앱 최적화)",
          ],
        },
        {
          title: "c. 광고 데이터",
          bullets: [
            "Google AdMob을 통해 익명화된 광고 상호작용 데이터를 수집할 수 있습니다",
            "Google AdMob 개인정보처리방침이 적용됩니다",
          ],
        },
        {
          title: "d. 결제 정보",
          bullets: [
            "결제는 App Store / Google Play 인앱 결제로 안전하게 처리됩니다",
            "신용카드·청구 정보를 당사가 저장·처리하지 않습니다",
            "결제는 Apple·Google 개인정보처리방침이 적용됩니다",
          ],
        },
        {
          title: "e. 선택적 분석 데이터",
          bullets: [
            "익명화된 앱 이용 통계",
            "정확도 개선을 위한 변환 성공률",
            "디버깅용 크래시·오류 로그",
          ],
        },
      ],
    },
    {
      title: "3. 이용 목적",
      bullets: [
        "사이즈 비교·변환 기능 제공",
        "사이즈표 데이터베이스 유지·업데이트",
        "결제 처리 및 프리미엄 기능 제공",
        "AdMob을 통한 관련 광고 표시",
        "앱 성능 개선 및 익명화된 이용 추이 파악",
        "고객 지원 및 문제 해결",
      ],
    },
    {
      title: "4. 데이터 보안",
      bullets: [
        "사이즈 선호·치수를 영구 저장하지 않습니다",
        "사이즈 비교는 기기에서 로컬로 처리됩니다",
        "사이즈표 데이터는 암호화된 Supabase에 저장됩니다",
        "결제·광고는 업계 표준 보안의 제3자 서비스를 이용합니다",
      ],
    },
    {
      title: "5. 제3자 서비스",
      paragraphs: ["다음 제3자 서비스를 이용합니다."],
      table: {
        headers: ["서비스", "목적", "정책"],
        rows: [
          ["Supabase", "사이즈표 데이터베이스", "https://supabase.com/privacy"],
          ["Google AdMob", "인앱 광고", "https://policies.google.com/technologies/ads"],
          ["Apple In-App Purchase", "결제(iOS)", "https://www.apple.com/legal/privacy/"],
          ["Google Play In-App Billing", "결제(Android)", "https://policies.google.com/privacy"],
          ["Google Analytics", "앱 분석", "https://policies.google.com/privacy"],
        ],
      },
    },
    {
      title: "6. 이용자 선택",
      bullets: [
        "개인정보 제공 없이 앱을 이용할 수 있습니다",
        "기기 설정에서 맞춤 광고를 거부할 수 있습니다",
        "앱 설정에서 분석 추적을 끌 수 있습니다",
        "계정 없이 프리미엄 기능을 구매할 수 있습니다",
      ],
    },
    {
      title: "7. 열람·정정·삭제",
      paragraphs: [
        "적용 법령에 따라 개인정보 열람·정정·삭제 또는 처리 동의 철회를 요청할 수 있습니다.",
        "요청은 raniii.com/contact 또는 support@raniii.com으로 연락해 주세요.",
        '계정 삭제는 support@raniii.com에 제목 "Delete My Account"로 요청해 주세요. 신원 확인 후 법령상 보관이 필요한 경우(예: 스토어 결제 기록)를 제외하고 7일 이내 삭제합니다.',
      ],
    },
    {
      title: "8. 문의",
      paragraphs: [
        "본 방침에 관한 문의는 개인정보 보호책임자에게 연락해 주세요.",
        "이메일: support@raniii.com",
        "전화: 469-240-9176",
        "bluetree · Data Protection Officer",
      ],
    },
    {
      title: "9. 방침 변경",
      paragraphs: [
        "본 방침은 수시로 업데이트될 수 있습니다. 변경 사항은 앱 및/또는 본 웹사이트에 게시되며, 상단의 날짜로 확인하실 수 있습니다.",
      ],
    },
  ],
};

export function getSizeGoPrivacy(locale: Locale): PrivacyDoc {
  return locale === "ko" ? ko : en;
}
