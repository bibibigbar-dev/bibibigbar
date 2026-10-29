import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { adsenseClient } from "@/lib/blog/config";
import { editorFontStylesheet } from "@/lib/blog/fonts";
import { getCurrentUser } from "@/lib/queries";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "800", "900"],
  display: "swap",
});

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
  const headerStore = await headers();
  const site = headerStore.get("x-bibibig-site");
  const isJournalHost = headerStore.get("x-bibibig-blog-mount") === "subdomain";
  if (site === "blog") {
    return (
      <html lang="en">
        {isJournalHost ? (
          <head>
            <AdSenseScript />
          </head>
        ) : null}
        <body className={`${archivo.className} antialiased`}>
          <EditorFonts />
          {children}
          <Analytics />
        </body>
      </html>
    );
  }

  const user = await getCurrentUser();

  return (
    <html lang="en">
      {site === "main" ? (
        <head>
          <AdSenseScript />
        </head>
      ) : null}
      <body className={`${archivo.className} antialiased`}>
        <EditorFonts />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SiteHeader user={user} />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
