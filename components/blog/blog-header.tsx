import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { mainMenuHref, shopMenuHref } from "@/lib/blog/config";
import { blogPath } from "@/lib/blog/paths";
import { getCurrentUser } from "@/lib/queries";

export async function BlogHeader() {
  const [home, user] = await Promise.all([blogPath(), getCurrentUser()]);

  return (
    <header className="site-header">
      <div className="site-bar">
        <Link href={home} className="site-wordmark">
          Bibibigbar
        </Link>
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
