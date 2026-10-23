import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentUser, getActiveBoards } from "@/lib/queries";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "bibibigbar — The Big Little Show",
    template: "%s · bibibigbar",
  },
  description:
    "조금 엉뚱해도, 꽤 근사한 나의 세계. 생각을 만들고 일상을 기록하는 bibibigbar의 작은 서커스에 오신 것을 환영합니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, boards] = await Promise.all([getCurrentUser(), getActiveBoards()]);

  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">본문으로 바로가기</a>
        <SiteHeader user={user} boards={boards} />
        <main id="main-content" className="min-h-[70vh]">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
