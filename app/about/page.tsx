import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "bibibigbar is a developer and maker based in Dallas.",
};

export default function AboutPage() {
  return (
    <div className="container page-hero">
      <p className="page-kicker">About</p>
      <h1>Hello.</h1>
      <p className="mt-8 max-w-2xl text-xl leading-relaxed">
        I&apos;m bibibigbar, a developer and maker based in Dallas. I build apps and websites, write about everyday life, and run a small shop.
      </p>
      <div className="soon-list mt-12">
        <div className="soon-row">
          <span>01</span>
          <span>YouTube</span>
          <span className="home-door-soon">Soon</span>
        </div>
        <div className="soon-row">
          <span>02</span>
          <span>Naver Blog</span>
          <span className="home-door-soon">Soon</span>
        </div>
        <a className="soon-row" href="mailto:bibibigbar@gmail.com">
          <span>03</span>
          <span>Email</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
}
