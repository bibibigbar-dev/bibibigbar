import { headers } from "next/headers";
import { blogMenuHref, mainMenuHref, shopMenuHref } from "@/lib/blog/config";

export async function SiteFooter() {
  const headerStore = await headers();
  const onShopHost = headerStore.get("x-bibibig-site") === "shop";
  const path = headerStore.get("x-bibibig-path") || "/";
  const onHome = !onShopHost && (path === "/" || path === "");
  const loginHref = onShopHost ? mainMenuHref("/login") : "/login";

  if (onHome) {
    return (
      <footer className="site-footer">
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} BIBIBIGBAR · Dallas, TX</span>
          <nav>
            <a href={blogMenuHref()}>Blog</a>
            <a href={shopMenuHref()}>Shop</a>
            <a href="/work">Work</a>
            <a href="/about">About</a>
            <a href="mailto:bibibigbar@gmail.com">Email</a>
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
          <a href={blogMenuHref()}>Blog</a>
          <a href={shopMenuHref()}>Shop</a>
          <a href={loginHref}>Log in</a>
        </nav>
      </div>
    </footer>
  );
}
