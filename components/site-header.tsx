import Link from "next/link";
import { headers } from "next/headers";
import { logoutAction } from "@/lib/actions/auth";
import { blogMenuHref, mainOrigin, shopMenuHref } from "@/lib/blog/config";
import type { SessionUser } from "@/lib/types";

interface SiteHeaderProps {
  user: SessionUser | null;
}

export async function SiteHeader({ user }: SiteHeaderProps) {
  const headerStore = await headers();
  const onShopHost = headerStore.get("x-bibibig-site") === "shop";
  const path = headerStore.get("x-bibibig-path") || "";
  const homeHref = onShopHost ? mainOrigin() : "/";
  const pageHref = (pathName: string) => (onShopHost ? `${mainOrigin()}${pathName}` : pathName);
  const shopCurrent = onShopHost || path === "/shop" || path.startsWith("/shop/");
  const current = (active: boolean) => (active ? "page" : undefined);

  return (
    <header className="site-header">
      <div className="site-bar">
        <Link href={homeHref} className="site-wordmark">
          Bibibigbar
        </Link>
        <nav aria-label="Main" className="site-nav">
          <a href={blogMenuHref()}>Blog</a>
          <a href={shopMenuHref()} aria-current={current(shopCurrent)}>
            Shop
          </a>
          <Link href={pageHref("/work")} aria-current={current(path === "/work" || path.startsWith("/work/"))}>
            Work
          </Link>
          <Link href={pageHref("/about")} aria-current={current(path === "/about" || path.startsWith("/about/"))}>
            About
          </Link>
          <Link href={pageHref("/admin")} aria-current={current(path === "/admin" || path.startsWith("/admin/"))}>
            Admin
          </Link>
        </nav>
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
