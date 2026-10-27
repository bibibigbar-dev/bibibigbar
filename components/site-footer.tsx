import { headers } from "next/headers";
import { mainOrigin } from "@/lib/blog/config";

export async function SiteFooter() {
  const headerStore = await headers();
  const onShopHost = headerStore.get("x-bibibig-site") === "shop";
  const homeHref = onShopHost ? mainOrigin() : "/";

  return (
    <footer className="site-footer">
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BIBIBIGBAR</span>
        <span>Dallas, TX</span>
        <a href={homeHref}>Back to top</a>
      </div>
    </footer>
  );
}
