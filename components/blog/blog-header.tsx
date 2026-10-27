import Link from "next/link";
import { headers } from "next/headers";
import { logoutAction } from "@/lib/actions/auth";
import { apexHomeHref, mainMenuHref, shopMenuHref } from "@/lib/blog/config";
import { blogPath } from "@/lib/blog/paths";
import { getCurrentUser } from "@/lib/queries";

export async function BlogHeader() {
  const [home, user, headerStore] = await Promise.all([blogPath(), getCurrentUser(), headers()]);
  const onBlogHost = headerStore.get("x-bibibig-blog-mount") === "subdomain";
  const siteHome = apexHomeHref(headerStore.get("host"), onBlogHost);

  return (
    <header className="site-header">
      <div className="site-bar">
        <a href={siteHome} className="site-wordmark">
          Bibibigbar
        </a>
        <nav aria-label="Journal" className="site-nav">
          <Link href={home} aria-current="page">
            Blog
          </Link>
          <a href={shopMenuHref()}>Shop</a>
          <a href={mainMenuHref("/work")}>Work</a>
          <a href={mainMenuHref("/about")}>About</a>
          <a href={mainMenuHref("/admin")}>Admin</a>
        </nav>
        {user ? (
          <form action={logoutAction} className="site-login">
            <button type="submit">Log out</button>
          </form>
        ) : (
          <a href={mainMenuHref("/login")} className="site-login">
            Log in →
          </a>
        )}
      </div>
    </header>
  );
}
