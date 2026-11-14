import Link from "next/link";
import { mainMenuHref } from "@/lib/blog/config";
import { getRequestLocale } from "@/lib/get-locale";
import { blogPath } from "@/lib/blog/paths";
import { getSiteCopy } from "@/lib/site-copy";

export async function BlogFooter() {
  const [home, locale] = await Promise.all([blogPath(), getRequestLocale()]);
  const nav = getSiteCopy(locale).nav;

  return (
    <footer className="blog-footer">
      <div className="blog-footer-bar">
        <span>© {new Date().getFullYear()} BIBIBIGBAR</span>
        <nav>
          <Link href={home}>{nav.blog}</Link>
          <a href={mainMenuHref("/travel-map")}>{nav.map}</a>
          <a href={mainMenuHref("/login")}>{nav.login}</a>
        </nav>
      </div>
    </footer>
  );
}
