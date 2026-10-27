import { headers } from "next/headers";
import { blogMenuHref, mainMenuHref, shopMenuHref } from "@/lib/blog/config";

export async function SiteFooter() {
  const headerStore = await headers();
  const onShopHost = headerStore.get("x-bibibig-site") === "shop";
  const loginHref = onShopHost ? mainMenuHref("/login") : "/login";

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
