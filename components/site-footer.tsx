import { headers } from "next/headers";
import Link from "next/link";
import { blogMenuHref, mainMenuHref } from "@/lib/blog/config";
import { getRequestLocale } from "@/lib/get-locale";
import { getSiteCopy } from "@/lib/site-copy";

export async function SiteFooter() {
  const [headerStore, locale] = await Promise.all([headers(), getRequestLocale()]);
  const onShopHost = headerStore.get("x-bibibig-site") === "shop";
  const path = headerStore.get("x-bibibig-path") || "/";
  const onHome = !onShopHost && (path === "/" || path === "");
  const onInkPage =
    path === "/travel-map" ||
    path.startsWith("/travel-map/") ||
    path === "/about" ||
    path.startsWith("/about/") ||
    path === "/work" ||
    path.startsWith("/work/"); // includes /work/[slug]
  const loginHref = onShopHost ? mainMenuHref("/login") : "/login";
  const nav = getSiteCopy(locale).nav;

  if (onInkPage) {
    return (
      <footer className="ink-page-footer">
        <span>© {new Date().getFullYear()} BIBIBIGBAR</span>
        <nav>
          <a href={blogMenuHref()}>{nav.blog}</a>
          <span aria-hidden="true">·</span>
          <Link href="/travel-map">{nav.map}</Link>
          <span aria-hidden="true">·</span>
          <Link href="/work">{nav.work}</Link>
          <span aria-hidden="true">·</span>
          <Link href="/about">{nav.about}</Link>
        </nav>
      </footer>
    );
  }

  if (onHome) {
    return (
      <footer className="site-footer">
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} BIBIBIGBAR</span>
          <nav>
            <a href={blogMenuHref()}>{nav.blog}</a>
            <Link href="/travel-map">{nav.map}</Link>
            <Link href="/work">{nav.work}</Link>
            <Link href="/about">{nav.about}</Link>
            <a href="mailto:bibibigbar@gmail.com">{nav.email}</a>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="blog-footer">
      <div className="blog-footer-bar">
        <span>© {new Date().getFullYear()} BIBIBIGBAR</span>
        <nav>
          <a href={blogMenuHref()}>{nav.blog}</a>
          <Link href="/travel-map">{nav.map}</Link>
          <a href={loginHref}>{nav.login}</a>
        </nav>
      </div>
    </footer>
  );
}
