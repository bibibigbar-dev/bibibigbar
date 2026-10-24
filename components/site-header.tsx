import Link from "next/link";
import { headers } from "next/headers";
import { logoutAction } from "@/lib/actions/auth";
import { blogMenuHref, mainOrigin, shopMenuHref } from "@/lib/blog/config";
import type { Board, SessionUser } from "@/lib/types";

interface SiteHeaderProps {
  user: SessionUser | null;
  boards: Board[];
}

export async function SiteHeader({ user, boards }: SiteHeaderProps) {
  const headerStore = await headers();
  const onShopHost = headerStore.get("x-bibibig-site") === "shop";
  const homeHref = onShopHost ? mainOrigin() : "/";
  const sectionHref = (hash: string) => (onShopHost ? `${mainOrigin()}${hash}` : hash);
  const journalHref = blogMenuHref();
  const shopHref = shopMenuHref();

  return (
    <header className="site-header">
      <div className="announcement"><span aria-hidden="true">✦</span> THE INTERNET IS A CIRCUS. THIS IS MY LITTLE CORNER. <span aria-hidden="true">✦</span></div>
      <div className="container flex items-center justify-between gap-4 py-3">
        <Link href={homeHref} className="site-wordmark" aria-label="bibibigbar home">
          <span aria-hidden="true">✳</span> bibibigbar<span className="wordmark-dot">.</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-semibold text-[var(--muted)] lg:flex">
          <Link href={sectionHref("/#program")} className="hover:text-[var(--sky-deep)]">
            Program
          </Link>
          <Link href={sectionHref("/#about")} className="hover:text-[var(--sky-deep)]">About</Link>
          <a href={journalHref} className="hover:text-[var(--sky-deep)]">
            Blog
          </a>
          <a href={shopHref} className="hover:text-[var(--sky-deep)]">
            Shop
          </a>
          <div className="group relative">
            <Link href="/boards" className="hover:text-[var(--sky-deep)]">
              Stories
            </Link>
            <div className="pointer-events-none absolute left-0 top-full z-50 hidden min-w-[220px] pt-3 group-hover:pointer-events-auto group-hover:block group-focus-within:pointer-events-auto group-focus-within:block">
              <div className="surface rounded-2xl p-2 shadow-[var(--shadow)]">
                {boards.map((board) => (
                  <Link
                    key={board.id}
                    href={`/boards/${board.slug}`}
                    className="block rounded-xl px-3 py-2 text-[var(--ink)] hover:bg-[rgba(31,95,139,0.08)]"
                  >
                    {board.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {user ? (
            <>
              <Link href="/my" className="hover:text-[var(--sky-deep)]">
                My Page
              </Link>
              {user.role === "admin" ? (
                <Link href="/admin" className="hover:text-[var(--sky-deep)]">
                  Admin
                </Link>
              ) : null}
            </>
          ) : null}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-[var(--muted)] sm:inline">{user.name}</span>
              <form action={logoutAction}>
                <button type="submit" className="btn btn-secondary !min-h-10 !px-4 text-sm">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-primary !min-h-10 !px-4 text-sm">
                Come in <span aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="container flex gap-2 overflow-x-auto pb-3 lg:hidden">
        <Link href={sectionHref("/#program")} className="badge whitespace-nowrap">Program</Link>
        <Link href={sectionHref("/#about")} className="badge whitespace-nowrap">About</Link>
        <a href={journalHref} className="badge whitespace-nowrap">
          Blog
        </a>
        <a href={shopHref} className="badge whitespace-nowrap">
          Shop
        </a>
        <Link href="/boards" className="badge whitespace-nowrap">
          All boards
        </Link>
        {boards.slice(0, 5).map((board) => (
          <Link key={board.id} href={`/boards/${board.slug}`} className="badge whitespace-nowrap">
            {board.name}
          </Link>
        ))}
        {user ? (
          <Link href="/my" className="badge whitespace-nowrap">
            My Page
          </Link>
        ) : null}
        {user?.role === "admin" ? (
          <Link href="/admin" className="badge whitespace-nowrap">
            Admin
          </Link>
        ) : null}
      </div>
    </header>
  );
}
