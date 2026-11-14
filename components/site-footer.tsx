import { headers } from "next/headers";
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
          <a href="/travel-map">{nav.map}</a>
          <span aria-hidden="true">·</span>
          <a href="/work">{nav.work}</a>
          <span aria-hidden="true">·</span>
          <a href="/about">{nav.about}</a>
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
            <a href="/travel-map">{nav.map}</a>
            <a href="/work">{nav.work}</a>
            <a href="/about">{nav.about}</a>
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
          <a href="/travel-map">{nav.map}</a>
          <a href={loginHref}>{nav.login}</a>
        </nav>
      </div>
    </footer>
  );
}
