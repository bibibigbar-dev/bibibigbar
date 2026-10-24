import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/blog/ad-slot";
import { PostCard } from "@/components/blog/post-card";
import { adsenseClient, adsenseSlot, blogOrigin } from "@/lib/blog/config";
import { getBlogRepository } from "@/lib/blog";
import { blogPath } from "@/lib/blog/paths";

export const dynamic = "force-dynamic";

interface BlogIndexProps {
  searchParams: Promise<{ tag?: string; destination?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: BlogIndexProps): Promise<Metadata> {
  const { tag, destination } = await searchParams;
  const label = destination || tag;
  return {
    title: {
      absolute: label ? `${label} · bibibigbar journal` : "bibibigbar journal",
    },
    description: label
      ? `Travel notes about ${label} from bibibigbar.`
      : "Travel notes from bibibigbar. Places, meals, and the slow parts of the road.",
    alternates: { canonical: blogOrigin() },
  };
}

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const { tag = "", destination = "", page: pageParam = "1" } = await searchParams;
  const repository = getBlogRepository();
  const published = await repository.listPublished();
  const home = await blogPath();
  const activeTag = tag.trim();
  const activeDestination = destination.trim();
  const filtered = published.filter((post) => {
    const matchesTag = activeTag ? post.tags.some((item) => item.toLowerCase() === activeTag.toLowerCase()) : true;
    const matchesDestination = activeDestination
      ? post.destination.toLowerCase() === activeDestination.toLowerCase()
      : true;
    return matchesTag && matchesDestination;
  });
  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = 9;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const destinations = [...new Set(published.map((post) => post.destination).filter(Boolean))].slice(0, 12);

  function hrefFor(nextPage: number, nextTag = activeTag, nextDestination = activeDestination) {
    const query = new URLSearchParams();
    if (nextTag) query.set("tag", nextTag);
    if (nextDestination) query.set("destination", nextDestination);
    if (nextPage > 1) query.set("page", String(nextPage));
    const qs = query.toString();
    return qs ? `${home}?${qs}` : home;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "bibibigbar journal",
    description: "Travel notes from bibibigbar.",
    url: blogOrigin(),
    inLanguage: "ko",
  };

  return (
    <div className="container py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="blog-kicker">Travel notes</p>
      <h1 className="display mt-2 text-5xl font-bold text-[var(--sky-deep)]">The road, written down.</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
        Places, meals, and the parts of a trip that do not fit in a checklist. New dispatches land here.
      </p>

      {destinations.length ? (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href={home} className={`blog-chip ${activeDestination || activeTag ? "" : "is-active"}`}>
            All
          </Link>
          {destinations.map((item) => (
            <Link
              key={item}
              href={hrefFor(1, "", item)}
              className={`blog-chip ${activeDestination.toLowerCase() === item.toLowerCase() ? "is-active" : ""}`}
            >
              {item}
            </Link>
          ))}
        </div>
      ) : null}

      {activeTag ? (
        <p className="mt-6 text-sm text-[var(--muted)]">
          Tagged {activeTag}. <Link href={hrefFor(1, "", activeDestination)}>Clear tag</Link>
        </p>
      ) : null}

      {visible.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((post, index) => (
            <div key={post.id} className="contents">
              <PostCard post={post} href={post.slug ? `${home === "/" ? "" : home}/${post.slug}` : home} />
              {index === 2 ? <AdSlot client={adsenseClient()} slot={adsenseSlot("feed")} /> : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="blog-empty">
          <h2>Nothing on this page yet.</h2>
          <p>The first dispatch is still being packed. Published travel notes will show up here.</p>
        </div>
      )}

      {pageCount > 1 ? (
        <nav className="mt-10 flex gap-2" aria-label="Pages">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <Link key={number} href={hrefFor(number)} className={`blog-chip ${number === currentPage ? "is-active" : ""}`}>
              {number}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
