import Link from "next/link";
import { blogMenuHref } from "@/lib/blog/config";
import { getRequestLocale } from "@/lib/get-locale";
import { getSiteCopy } from "@/lib/site-copy";

export default async function HomePage() {
  const locale = await getRequestLocale();
  const copy = getSiteCopy(locale).home;
  const loop = [copy.ticker, copy.ticker];
  const doors: Array<{
    index: string;
    title: string;
    copy: string;
    href: string;
    external: boolean;
    soon?: boolean;
  }> = [
    {
      ...copy.doors[0],
      href: blogMenuHref(),
      external: true,
    },
    {
      ...copy.doors[1],
      href: "/travel-map",
      external: false,
    },
    {
      ...copy.doors[2],
      href: "/work",
      external: false,
      soon: true,
    },
    {
      ...copy.doors[3],
      href: "/about",
      external: false,
    },
  ];

  return (
    <div>
      <h1 className="home-hero">
        {copy.heroLead}
        <br />
        bibi<span className="title-mark">b</span>igbar.
        <br />
        {copy.heroEnd}
      </h1>
      <div className="home-ticker">
        <div className="home-ticker-track">
          {loop.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
      {doors.map((door) => {
        const inner = (
          <>
            <span className="home-door-index">{door.index}</span>
            <span className="home-door-title">{door.title}</span>
            <span className="home-door-copy">{door.copy}</span>
            {door.soon ? (
              <span className="home-door-soon">{copy.soon}</span>
            ) : (
              <span className="home-door-soon line-arrow">{"\u2197\uFE0E"}</span>
            )}
          </>
        );
        if (door.external) {
          return (
            <a key={door.index} href={door.href} className="home-door">
              {inner}
            </a>
          );
        }
        return (
          <Link key={door.index} href={door.href} className="home-door">
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
