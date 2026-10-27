import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { adsenseClient } from "@/lib/blog/config";
import { editorFontStylesheet } from "@/lib/blog/fonts";
import { getCurrentUser, getActiveBoards } from "@/lib/queries";
import "./globals.css";

function EditorFonts() {
  return <link rel="stylesheet" href={editorFontStylesheet} />;
}

function AdSenseScript() {
  const client = adsenseClient();
  if (!client) return null;

  return (
    <>
      <meta name="google-adsense-account" content={client} />
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
    </>
  );
}

export const metadata: Metadata = {
  title: {
    default: "bibibigbar — The Big Little Show",
    template: "%s · bibibigbar",
  },
  description:
    "A little offbeat, and still a fine little world. Welcome to bibibigbar's small circus for making things and keeping notes.",
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const isJournalHost = headerStore.get("x-bibibig-blog-mount") === "subdomain";
  if (headerStore.get("x-bibibig-site") === "blog") {
    return (
      <html lang="en">
        {isJournalHost ? (
          <head>
            <AdSenseScript />
          </head>
        ) : null}
        <body className="font-sans antialiased">
          <EditorFonts />
          {children}
          <Analytics />
        </body>
      </html>
    );
  }

  const [user, boards] = await Promise.all([getCurrentUser(), getActiveBoards()]);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <EditorFonts />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SiteHeader user={user} boards={boards} />
        <main id="main-content" className="min-h-[70vh]">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
