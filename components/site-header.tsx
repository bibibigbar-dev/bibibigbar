import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import type { Board, SessionUser } from "@/lib/types";

interface SiteHeaderProps {
  user: SessionUser | null;
  boards: Board[];
}

export function SiteHeader({ user, boards }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="announcement"><span aria-hidden="true">✦</span> THE INTERNET IS A CIRCUS. THIS IS MY LITTLE CORNER. <span aria-hidden="true">✦</span></div>
      <div className="container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="site-wordmark" aria-label="bibibigbar 홈">
          <span aria-hidden="true">✳</span> bibibigbar<span className="wordmark-dot">.</span>
        </Link>

        <nav aria-label="메인 메뉴" className="hidden items-center gap-7 text-sm font-semibold text-[var(--muted)] lg:flex">
          <Link href="/#program" className="hover:text-[var(--sky-deep)]">
            프로그램
          </Link>
          <Link href="/#about" className="hover:text-[var(--sky-deep)]">소개</Link>
          <div className="group relative">
            <Link href="/boards" className="hover:text-[var(--sky-deep)]">
              이야기
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
              <Link href="/login" className="btn btn-secondary !min-h-10 !px-4 text-sm">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary !min-h-10 !px-4 text-sm">
                입장하기 <span aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="container flex gap-2 overflow-x-auto pb-3 lg:hidden">
        <Link href="/#program" className="badge whitespace-nowrap">프로그램</Link>
        <Link href="/#about" className="badge whitespace-nowrap">소개</Link>
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
