import Link from "next/link";
import { blogMenuHref, shopMenuHref } from "@/lib/blog/config";

const ticker =
  "I have a dream. There was a dream higher than the sky. I want to know. Can't you just give me the confidence to push ahead my own way?";

const doors = [
  {
    index: "01",
    title: "Blog",
    copy: "Writing about everyday life, making, and wandering.",
    href: blogMenuHref(),
    external: true,
  },
  {
    index: "02",
    title: "Shop",
    copy: "Small goods, made and picked by me.",
    href: shopMenuHref(),
    external: true,
  },
  {
    index: "03",
    title: "Work",
    copy: "Apps and websites. Still being collected.",
    href: "/work",
    external: false,
    soon: true,
  },
  {
    index: "04",
    title: "About",
    copy: "A developer and maker based in Dallas.",
    href: "/about",
    external: false,
  },
];

export default function HomePage() {
  const loop = [ticker, ticker];

  return (
    <div>
      <h1 className="home-hero">
        Hi, I&apos;m
        <br />
        bibi<span className="title-mark">b</span>igbar.
        <br />
        I make things.
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
            {door.soon ? <span className="home-door-soon">Soon</span> : null}
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
