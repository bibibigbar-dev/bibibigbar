import Link from "next/link";
import { headers } from "next/headers";
import { logoutAction } from "@/lib/actions/auth";
import { LocaleSwitch } from "@/components/locale-switch";
import { apexHomeHref, mainMenuHref } from "@/lib/blog/config";
import { getRequestLocale } from "@/lib/get-locale";
import { blogPath } from "@/lib/blog/paths";
import { getCurrentUser } from "@/lib/queries";
import { getSiteCopy } from "@/lib/site-copy";

export async function BlogHeader() {
  const [home, user, headerStore, locale] = await Promise.all([
    blogPath(),
    getCurrentUser(),
    headers(),
    getRequestLocale(),
  ]);
  const onBlogHost = headerStore.get("x-bibibig-blog-mount") === "subdomain";
  const siteHome = apexHomeHref(headerStore.get("host"), onBlogHost);
  const nav = getSiteCopy(locale).nav;

  return (
    <header className="site-header">
      <div className="site-bar">
        <a href={siteHome} className="site-wordmark">
          Bibibigbar
        </a>
        <nav aria-label={nav.journalAria} className="site-nav">
          <Link href={home} aria-current="page">
            {nav.blog}
          </Link>
          <a href={mainMenuHref("/travel-map")}>{nav.map}</a>
          <a href={mainMenuHref("/work")}>{nav.work}</a>
          <a href={mainMenuHref("/about")}>{nav.about}</a>
          <a href={mainMenuHref("/admin")}>{nav.admin}</a>
        </nav>
        <div className="site-actions">
          <LocaleSwitch locale={locale} />
          {user ? (
            <form action={logoutAction} className="site-login">
              <button type="submit">{nav.logout}</button>
            </form>
          ) : (
            <a href={mainMenuHref("/login")} className="site-login">
              {nav.login}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
