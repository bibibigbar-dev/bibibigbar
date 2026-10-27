import Link from "next/link";
import { headers } from "next/headers";
import { logoutAction } from "@/lib/actions/auth";
import { blogMenuHref, mainOrigin, shopMenuHref } from "@/lib/blog/config";
import { SiteMenu } from "@/components/site-menu";
import type { SessionUser } from "@/lib/types";

interface SiteHeaderProps {
  user: SessionUser | null;
}

export async function SiteHeader({ user }: SiteHeaderProps) {
  const headerStore = await headers();
  const onShopHost = headerStore.get("x-bibibig-site") === "shop";
  const homeHref = onShopHost ? mainOrigin() : "/";
  const pageHref = (pathName: string) => (onShopHost ? `${mainOrigin()}${pathName}` : pathName);

  return (
    <header className="site-header">
      <div className="site-bar">
        <Link href={homeHref} className="site-wordmark">
          Bibibigbar
        </Link>
        <SiteMenu
          blogHref={blogMenuHref()}
          shopHref={shopMenuHref()}
          workHref={pageHref("/work")}
          aboutHref={pageHref("/about")}
          adminHref={pageHref("/admin")}
          onShopHost={onShopHost}
        />
        {user ? (
          <form action={logoutAction} className="site-login">
            <button type="submit">Log out</button>
          </form>
        ) : (
          <Link href={pageHref("/login")} className="site-login">
            Log in →
          </Link>
        )}
      </div>
    </header>
  );
}
