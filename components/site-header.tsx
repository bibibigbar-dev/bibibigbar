import Link from "next/link";
import { headers } from "next/headers";
import { logoutAction } from "@/lib/actions/auth";
import { apexHomeHref, blogMenuHref, mainOrigin } from "@/lib/blog/config";
import { LocaleSwitch } from "@/components/locale-switch";
import { SiteMenu } from "@/components/site-menu";
import { getRequestLocale } from "@/lib/get-locale";
import { getSiteCopy } from "@/lib/site-copy";
import type { SessionUser } from "@/lib/types";

interface SiteHeaderProps {
  user: SessionUser | null;
}

export async function SiteHeader({ user }: SiteHeaderProps) {
  const [headerStore, locale] = await Promise.all([headers(), getRequestLocale()]);
  const onShopHost = headerStore.get("x-bibibig-site") === "shop";
  const homeHref = apexHomeHref(headerStore.get("host"), onShopHost);
  const pageHref = (pathName: string) => (onShopHost ? `${mainOrigin()}${pathName}` : pathName);
  const nav = getSiteCopy(locale).nav;

  return (
    <header className="site-header">
      <div className="site-bar">
        {homeHref.startsWith("/") ? (
          <Link href={homeHref} className="site-wordmark">
            Bibibigbar
          </Link>
        ) : (
          <a href={homeHref} className="site-wordmark">
            Bibibigbar
          </a>
        )}
        <SiteMenu
          locale={locale}
          blogHref={blogMenuHref()}
          mapHref={pageHref("/travel-map")}
          workHref={pageHref("/work")}
          aboutHref={pageHref("/about")}
          adminHref={pageHref("/admin")}
        />
        <div className="site-actions">
          <LocaleSwitch locale={locale} />
          {user ? (
            <form action={logoutAction} className="site-login">
              <button type="submit">{nav.logout}</button>
            </form>
          ) : (
            <Link href={pageHref("/login")} className="site-login">
              {nav.login}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
