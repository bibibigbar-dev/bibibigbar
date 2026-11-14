import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { adsenseClient } from "@/lib/blog/config";
import { editorFontStylesheet } from "@/lib/blog/fonts";
import { getRequestLocale } from "@/lib/get-locale";
import { getCurrentUser } from "@/lib/queries";
import { getSiteCopy } from "@/lib/site-copy";
import "./globals.css";

const archivoStylesheet =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;800;900&display=swap";

function EditorFonts() {
  return (
    <>
      <link rel="stylesheet" href={archivoStylesheet} />
      <link rel="stylesheet" href={editorFontStylesheet} />
    </>
  );
}

function AdSenseScript({ loadScript = true }: { loadScript?: boolean }) {
  const client = adsenseClient();
  if (!client) return null;

  return (
    <>
      <meta name="google-adsense-account" content={client} />
      {loadScript ? (
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
      ) : null}
    </>
  );
}

export const metadata: Metadata = {
  title: {
    default: "bibibigbar",
    template: "%s · bibibigbar",
  },
  description: "I make things, keep notes, and wander off sometimes.",
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [headerStore, locale] = await Promise.all([headers(), getRequestLocale()]);
  const site = headerStore.get("x-bibibig-site");
  const isJournalHost = headerStore.get("x-bibibig-blog-mount") === "subdomain";
  const htmlLang = locale === "ko" ? "ko" : "en";
  if (site === "blog") {
    return (
      <html lang={htmlLang}>
        {isJournalHost ? (
          <head>
            <AdSenseScript />
          </head>
        ) : null}
        <body className="antialiased">
          <EditorFonts />
          {children}
          <Analytics />
        </body>
      </html>
    );
  }

  const user = await getCurrentUser();
  const skip = getSiteCopy(locale).skip;

  return (
    <html lang={htmlLang}>
      {site === "main" ? (
        <head>
          <AdSenseScript loadScript={false} />
        </head>
      ) : null}
      <body className="antialiased">
        <EditorFonts />
        <a href="#main-content" className="skip-link">
          {skip}
        </a>
        <SiteHeader user={user} />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
