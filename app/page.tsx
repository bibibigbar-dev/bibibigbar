import { HomeDoors } from "@/components/home-doors";
import { getBlogRepository } from "@/lib/blog";
import { blogMenuHref } from "@/lib/blog/config";
import { getRequestLocale } from "@/lib/get-locale";
import { getSiteCopy } from "@/lib/site-copy";

export default async function HomePage() {
  const locale = await getRequestLocale();
  const copy = getSiteCopy(locale).home;
  const loop = [copy.ticker, copy.ticker];
  const latest = (await getBlogRepository().listPublished())[0] || null;
  const blogBase = blogMenuHref().replace(/\/$/, "");
  const doors = [
    {
      ...copy.doors[0],
      href: blogMenuHref(),
      external: true,
      previewKey: "blog" as const,
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
      <HomeDoors
        doors={doors}
        soonLabel={copy.soon}
        blogPreview={
          latest
            ? {
                title: latest.title,
                coverImageUrl: latest.coverImageUrl,
                href: `${blogBase}/${latest.slug}`,
              }
            : null
        }
      />
    </div>
  );
}
