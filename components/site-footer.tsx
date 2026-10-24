import Link from "next/link";
import { headers } from "next/headers";
import { blogMenuHref, mainOrigin, shopMenuHref } from "@/lib/blog/config";

export async function SiteFooter() {
  const headerStore = await headers();
  const onShopHost = headerStore.get("x-bibibig-site") === "shop";
  const homeHref = onShopHost ? mainOrigin() : "/";

  return (
    <footer className="site-footer">
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href={homeHref} className="site-wordmark">✳ bibibigbar.</Link>
          <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
            A small corner of the internet. A big believer in curiosity.
          </p>
        </div>
        <div className="flex shrink-0 gap-4 whitespace-nowrap text-sm font-semibold text-[var(--muted)]">
          <Link href={onShopHost ? `${mainOrigin()}/#program` : "/#program"}>Program</Link>
          <a href={blogMenuHref()}>Blog</a>
          <a href={shopMenuHref()}>Shop</a>
          <Link href="/boards">Stories</Link>
          <Link href="/login">Log in</Link>
        </div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} BIBIBIGBAR</span><span>MADE WITH CURIOSITY & A LITTLE CHAOS <span aria-hidden="true">✦</span></span><a href="#main-content">BACK TO TOP ↑</a></div>
    </footer>
  );
}
