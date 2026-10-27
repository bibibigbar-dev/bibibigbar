import Link from "next/link";
import { mainMenuHref, shopMenuHref } from "@/lib/blog/config";
import { blogPath } from "@/lib/blog/paths";

export async function BlogFooter() {
  const home = await blogPath();

  return (
    <footer className="blog-footer">
      <div className="blog-footer-bar">
        <span>© {new Date().getFullYear()} BIBIBIGBAR</span>
        <nav>
          <Link href={home}>Blog</Link>
          <a href={shopMenuHref()}>Shop</a>
          <a href={mainMenuHref("/login")}>Log in</a>
        </nav>
      </div>
    </footer>
  );
}
