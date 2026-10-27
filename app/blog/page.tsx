import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/blog/ad-slot";
import { adsenseClient, adsenseSlot, blogOrigin } from "@/lib/blog/config";
import { getBlogRepository } from "@/lib/blog";
import { blogPath, getBlogMount } from "@/lib/blog/paths";
import type { BlogPost } from "@/lib/blog/types";

export const dynamic = "force-dynamic";

interface BlogIndexProps {
  searchParams: Promise<{ tag?: string; destination?: string; page?: string; q?: string }>;
}

function shortDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
}

function categoryLabel(post: BlogPost) {
  const destination = post.destination.trim();
  if (destination && destination !== "-") return destination;
  return post.tags[0] || "";
}

export async function generateMetadata({ searchParams }: BlogIndexProps): Promise<Metadata> {
  const { tag, destination } = await searchParams;
  const label = destination || tag;
  return {
    title: {
      absolute: label ? `${label} · bibibigbar` : "Blog · bibibigbar",
    },
    description: label
      ? `Notes about ${label} from bibibigbar.`
      : "Notes from the everyday. Writing about life, making, and wandering.",
    alternates: { canonical: blogOrigin() },
  };
}

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const { tag = "", destination = "", page: pageParam = "1", q = "" } = await searchParams;
  const repository = getBlogRepository();
  const published = await repository.listPublished();
  const home = await blogPath();
  const showAds = (await getBlogMount()) === "subdomain";
  const activeTag = tag.trim();
  const activeDestination = destination.trim();
  const query = q.trim();
  const filtered = published.filter((post) => {
    const matchesTag = activeTag ? post.tags.some((item) => item.toLowerCase() === activeTag.toLowerCase()) : true;
    const matchesDestination = activeDestination
      ? post.destination.toLowerCase() === activeDestination.toLowerCase()
      : true;
    const haystack = `${post.title} ${post.excerpt} ${post.destination} ${post.tags.join(" ")}`.toLowerCase();
    const matchesQuery = query ? haystack.includes(query.toLowerCase()) : true;
    return matchesTag && matchesDestination && matchesQuery;
  });
  const pageSize = 8;
  const page = Math.max(1, Number(pageParam) || 1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const featured = currentPage === 1 ? visible[0] : undefined;
  const rows = featured ? visible.slice(1) : visible;
  const categories = [...new Set(published.map(categoryLabel).filter(Boolean))].slice(0, 8);

  function hrefFor(nextPage: number, nextTag = activeTag, nextDestination = activeDestination, nextQuery = query) {
    const params = new URLSearchParams();
    if (nextTag) params.set("tag", nextTag);
    if (nextDestination) params.set("destination", nextDestination);
    if (nextQuery) params.set("q", nextQuery);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    return qs ? `${home}?${qs}` : home;
  }

  function postHref(post: BlogPost) {
    if (!post.slug) return home;
    return `${home === "/" ? "" : home}/${post.slug}`;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "bibibigbar",
    description: "Notes from the everyday.",
    url: blogOrigin(),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="blog-index-hero">
        <h1 className="blog-index-title">
          Bl<span className="title-mark">o</span>g
        </h1>
        <div className="blog-index-aside">
          <span>Notes from the everyday</span>
          <span className="blog-index-count">
            {filtered.length} {filtered.length === 1 ? "post" : "posts"}
          </span>
        </div>
      </div>

      <div className="blog-filters">
        <Link href={hrefFor(1, "", "", query)} className={`blog-pill ${activeDestination || activeTag ? "" : "is-active"}`}>
          All
        </Link>
        {categories.map((item) => {
          const matchesDestination = published.some(
            (post) => post.destination.trim().toLowerCase() === item.toLowerCase(),
          );
          const isActive = matchesDestination
            ? activeDestination.toLowerCase() === item.toLowerCase()
            : activeTag.toLowerCase() === item.toLowerCase();
          return (
            <Link
              key={item}
              href={hrefFor(1, matchesDestination ? "" : item, matchesDestination ? item : "", query)}
              className={`blog-pill ${isActive ? "is-active" : ""}`}
            >
              {item}
            </Link>
          );
        })}
        <form className="blog-search" action={home}>
          {activeDestination ? <input type="hidden" name="destination" value={activeDestination} /> : null}
          {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
          <input name="q" defaultValue={query} placeholder="Search" aria-label="Search posts" />
          <button type="submit" aria-label="Search">
            ⌕
          </button>
        </form>
      </div>

      {activeTag ? (
        <p className="blog-filters">
          Tagged {activeTag}. <Link href={hrefFor(1, "", activeDestination, query)}>Clear tag</Link>
        </p>
      ) : null}

      {featured ? (
        <Link href={postHref(featured)} className="blog-feature">
          <div className="blog-feature-cover">
            {featured.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.coverImageUrl} alt="" />
            ) : null}
          </div>
          <div className="blog-feature-copy">
            <p className="blog-feature-meta">
              <span>Latest</span>
              <span>
                {[categoryLabel(featured), shortDate(featured.publishedAt), `${featured.readingMinutes} min`]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </p>
            <h2>{featured.title}</h2>
            <span>Read →</span>
          </div>
        </Link>
      ) : null}

      {showAds && featured ? <AdSlot client={adsenseClient()} slot={adsenseSlot("feed")} /> : null}

      {rows.map((post) => (
        <Link key={post.id} href={postHref(post)} className="blog-row">
          <span className="blog-row-date">{shortDate(post.publishedAt)}</span>
          <span className="blog-row-title">{post.title}</span>
          <span className="blog-row-label">{categoryLabel(post)}</span>
          <span className="blog-row-arrow">↗</span>
        </Link>
      ))}

      {!visible.length ? (
        <div className="blog-empty">
          <h2>Nothing here yet.</h2>
          <p>Published notes will show up on this list.</p>
        </div>
      ) : null}

      {currentPage < pageCount ? (
        <div className="blog-more">
          <Link href={hrefFor(currentPage + 1)}>Load more ↓</Link>
        </div>
      ) : null}
    </div>
  );
}
