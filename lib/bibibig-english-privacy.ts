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
  kicker: "BIBIBIG ENGLISH",
  updated: "Last updated January 15, 2025",
  effective: "Effective Date: 01.15.2025",
  back: "← Back to Bibibig English",
  button: "Privacy Policy",
  intro: [
    'Bibibig English ("we", "our", or "us") provides a paid subscription English learning app for everyday situations such as school, the doctor, and daycare ("App"). This Privacy Policy explains how we collect, use, and protect your information when you use our App.',
    'This Privacy Notice for bluetree ("we," "us," or "our") also describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you download and use Bibibig English.',
  ],
  sections: [
    {
      title: "1. Paid App & Advertising",
      paragraphs: [
        "Bibibig English is a paid subscription product. Access to the App requires an active subscription purchased through the Apple App Store or Google Play.",
        "We do not show third-party advertising in the App, and we do not use advertising SDKs such as Google AdMob.",
      ],
    },
    {
      title: "2. Information We Do Not Collect",
      paragraphs: ["We respect your privacy. Our app is designed to collect minimal personal information. Specifically:"],
      bullets: [
        "No separate account or login is required beyond your App Store or Google Play purchase",
        "We do not sell your personal information",
        "Practice inputs and reply drafts are used to provide learning features and are not sold to advertisers",
        "We do not track shopping or advertising profiles for marketing networks",
      ],
    },
    {
      title: "3. Information We May Collect",
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
          title: "b. Learning & Usage Data",
          bullets: [
            "Feature usage patterns (anonymized), such as situation practice and reply helpers",
            "Language and content preferences needed to show lessons in your language",
            "Progress indicators stored on your device when possible",
          ],
        },
        {
          title: "c. AI Reply Helpers",
          bullets: [
            "When you use reply or practice helpers, the text you submit may be sent to our secure backend so an AI provider can generate a response",
            "Those messages are processed to return a reply and are not kept as a long-term personal profile",
            "Do not enter sensitive personal data (for example medical details, passwords, or payment numbers) into reply helpers",
          ],
        },
        {
          title: "d. Subscription & Payment Information",
          bullets: [
            "Subscriptions are processed securely via App Store In-App Purchase and Google Play Billing",
            "We do not store or process your credit card or billing data",
            "Purchase status may be checked on-device to unlock the App",
            "Payment processing is subject to Apple App Store and Google Play privacy policies",
          ],
        },
        {
          title: "e. Optional Analytics Data",
          bullets: [
            "App usage statistics (anonymized)",
            "Crash reports and error logs for debugging",
          ],
        },
      ],
    },
    {
      title: "4. How We Use Your Information",
      bullets: [
        "To provide English learning content, reply helpers, and practice features",
        "To verify subscription status and restore purchases",
        "To load lesson and catalog data from our secure backend",
        "To improve app performance and understand usage trends (anonymized)",
        "To provide customer support and troubleshooting",
      ],
    },
    {
      title: "5. Data Security",
      bullets: [
        "Lesson and catalog data may be stored in a secure Supabase database with encryption",
        "Subscription verification is handled through Apple and Google billing systems",
        "AI reply requests are sent over encrypted connections to our backend",
        "We do not use advertising networks inside the App",
      ],
    },
    {
      title: "6. Third-Party Services",
      paragraphs: ["We use the following third-party providers:"],
      table: {
        headers: ["Service", "Purpose", "Policy"],
        rows: [
          ["Supabase", "Lesson / catalog data & reply backend", "https://supabase.com/privacy"],
          ["Apple In-App Purchase", "Subscription billing (iOS)", "https://www.apple.com/legal/privacy/"],
          ["Google Play Billing", "Subscription billing (Android)", "https://policies.google.com/privacy"],
          ["AI provider (via our backend)", "Reply / practice text generation", "Processed only to return a response"],
        ],
      },
    },
    {
      title: "7. Your Choices",
      bullets: [
        "You can manage, cancel, or restore your subscription in App Store or Google Play settings",
        "You may stop using reply helpers if you do not want text sent for AI generation",
        "You can contact us to request deletion of eligible personal data we hold",
      ],
    },
    {
      title: "8. Review, Update, or Delete Your Data",
      paragraphs: [
        "Depending on applicable law, you may have the right to request access to, correct, or delete personal information we hold about you, or withdraw consent to processing.",
        "To request review, update, or deletion, visit raniii.com/contact or email support@raniii.com.",
        'For deletion requests, email support@raniii.com with the subject "Delete My Data". We will verify your identity and delete eligible data within 7 days, except where retention is required by law (for example App Store or Google Play payment history).',
      ],
    },
    {
      title: "9. Contact Us",
      paragraphs: [
        "If you have questions or concerns about this Privacy Policy, contact our Data Protection Officer:",
        "Email: support@raniii.com",
        "Phone: 469-240-9176",
        "bluetree · Data Protection Officer",
      ],
    },
    {
      title: "10. Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. Any changes will be posted within the App and/or on this website. The updated version will be indicated by an updated date at the top of this notice.",
      ],
    },
  ],
};

const ko: PrivacyDoc = {
  title: "개인정보처리방침",
  kicker: "BIBIBIG ENGLISH",
  updated: "최종 업데이트: 2025년 1월 15일",
  effective: "시행일: 2025.01.15",
  back: "← Bibibig English로 돌아가기",
  button: "개인정보처리방침",
  intro: [
    'Bibibig English("우리", "당사")는 학교·병원·어린이집 등 일상 상황을 위한 유료 구독형 영어 학습 앱("앱")을 제공합니다. 본 개인정보처리방침은 앱 이용 시 정보를 어떻게 수집·이용·보호하는지 설명합니다.',
    "bluetree의 본 고지는 Bibibig English를 다운로드·이용할 때 개인정보를 어떻게 처리하는지도 함께 안내합니다.",
  ],
  sections: [
    {
      title: "1. 유료 앱 및 광고",
      paragraphs: [
        "Bibibig English는 유료 구독 상품입니다. Apple App Store 또는 Google Play에서 구매한 활성 구독이 있어야 앱을 이용할 수 있습니다.",
        "앱 내 제3자 광고를 표시하지 않으며, Google AdMob 등 광고 SDK를 사용하지 않습니다.",
      ],
    },
    {
      title: "2. 수집하지 않는 정보",
      paragraphs: ["당사는 개인정보 수집을 최소화합니다. 구체적으로:"],
      bullets: [
        "App Store / Google Play 구매 외에 별도의 계정·로그인은 필요하지 않습니다",
        "개인정보를 판매하지 않습니다",
        "연습 입력·답장 초안은 학습 기능 제공에만 쓰이며 광고주에게 판매되지 않습니다",
        "광고 네트워크용 쇼핑·광고 프로필을 추적하지 않습니다",
      ],
    },
    {
      title: "3. 수집할 수 있는 정보",
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
          title: "b. 학습·이용 데이터",
          bullets: [
            "상황 연습·답장 도우미 등 기능 사용 패턴(익명화)",
            "내 언어로 레슨을 보여주기 위한 언어·콘텐츠 설정",
            "가능한 경우 기기 내 저장되는 진행 상태",
          ],
        },
        {
          title: "c. AI 답장 도우미",
          bullets: [
            "답장·연습 도우미 사용 시, 입력한 텍스트가 응답 생성을 위해 보안 백엔드로 전송될 수 있습니다",
            "해당 메시지는 답변 반환을 위해 처리되며 장기 개인 프로필로 보관하지 않습니다",
            "민감한 개인정보(의료 상세, 비밀번호, 결제 번호 등)는 도우미에 입력하지 마세요",
          ],
        },
        {
          title: "d. 구독·결제 정보",
          bullets: [
            "구독은 App Store / Google Play 결제로 안전하게 처리됩니다",
            "신용카드·청구 정보를 당사가 저장·처리하지 않습니다",
            "앱 잠금 해제를 위해 기기에서 구매 상태를 확인할 수 있습니다",
            "결제는 Apple·Google 개인정보처리방침이 적용됩니다",
          ],
        },
        {
          title: "e. 선택적 분석 데이터",
          bullets: ["익명화된 앱 이용 통계", "디버깅용 크래시·오류 로그"],
        },
      ],
    },
    {
      title: "4. 이용 목적",
      bullets: [
        "영어 학습 콘텐츠·답장 도우미·연습 기능 제공",
        "구독 상태 확인 및 구매 복원",
        "보안 백엔드에서 레슨·카탈로그 데이터 로드",
        "앱 성능 개선 및 익명화된 이용 추이 파악",
        "고객 지원 및 문제 해결",
      ],
    },
    {
      title: "5. 데이터 보안",
      bullets: [
        "레슨·카탈로그 데이터는 암호화된 Supabase에 저장될 수 있습니다",
        "구독 확인은 Apple·Google 결제 시스템을 통해 처리됩니다",
        "AI 답장 요청은 암호화된 연결로 백엔드에 전송됩니다",
        "앱 내 광고 네트워크를 사용하지 않습니다",
      ],
    },
    {
      title: "6. 제3자 서비스",
      paragraphs: ["다음 제3자 서비스를 이용합니다."],
      table: {
        headers: ["서비스", "목적", "정책"],
        rows: [
          ["Supabase", "레슨/카탈로그 및 답장 백엔드", "https://supabase.com/privacy"],
          ["Apple In-App Purchase", "구독 결제(iOS)", "https://www.apple.com/legal/privacy/"],
          ["Google Play Billing", "구독 결제(Android)", "https://policies.google.com/privacy"],
          ["AI provider (via our backend)", "답장/연습 텍스트 생성", "응답 반환 목적으로만 처리"],
        ],
      },
    },
    {
      title: "7. 이용자 선택",
      bullets: [
        "App Store / Google Play 설정에서 구독을 관리·해지·복원할 수 있습니다",
        "AI 생성용 텍스트 전송을 원하지 않으면 답장 도우미 사용을 중단할 수 있습니다",
        "당사가 보유한 적격 개인정보 삭제를 요청할 수 있습니다",
      ],
    },
    {
      title: "8. 열람·정정·삭제",
      paragraphs: [
        "적용 법령에 따라 개인정보 열람·정정·삭제 또는 처리 동의 철회를 요청할 수 있습니다.",
        "요청은 raniii.com/contact 또는 support@raniii.com으로 연락해 주세요.",
        '삭제 요청은 support@raniii.com에 제목 "Delete My Data"로 보내 주세요. 신원 확인 후 법령상 보관이 필요한 경우(예: 스토어 결제 기록)를 제외하고 7일 이내 삭제합니다.',
      ],
    },
    {
      title: "9. 문의",
      paragraphs: [
        "본 방침에 관한 문의는 개인정보 보호책임자에게 연락해 주세요.",
        "이메일: support@raniii.com",
        "전화: 469-240-9176",
        "bluetree · Data Protection Officer",
      ],
    },
    {
      title: "10. 방침 변경",
      paragraphs: [
        "본 방침은 수시로 업데이트될 수 있습니다. 변경 사항은 앱 및/또는 본 웹사이트에 게시되며, 상단의 날짜로 확인하실 수 있습니다.",
      ],
    },
  ],
};

export function getBibibigEnglishPrivacy(locale: Locale): PrivacyDoc {
  return locale === "ko" ? ko : en;
}
