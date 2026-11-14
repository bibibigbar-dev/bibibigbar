import type { Metadata } from "next";
import Link from "next/link";
import { blogOrigin } from "@/lib/blog/config";
import { getBlogRepository } from "@/lib/blog";
import { blogPath } from "@/lib/blog/paths";
import type { BlogPost } from "@/lib/blog/types";
import { getRequestLocale } from "@/lib/get-locale";
import type { Locale } from "@/lib/locale";
import { getSiteCopy } from "@/lib/site-copy";

export const dynamic = "force-dynamic";

interface BlogIndexProps {
  searchParams: Promise<{ tag?: string; category?: string; destination?: string; page?: string; q?: string }>;
}

function shortDate(value: string | null, locale: Locale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function categoryLabel(post: BlogPost) {
  const category = post.category.trim();
  if (category && category !== "-") return category;
  return post.tags[0] || "";
}

export async function generateMetadata({ searchParams }: BlogIndexProps): Promise<Metadata> {
  const { tag, category, destination } = await searchParams;
  const locale = await getRequestLocale();
  const copy = getSiteCopy(locale).blog;
  const label = category || destination || tag;
  return {
    title: {
      absolute: label ? `${label} · bibibigbar` : "Blog · bibibigbar",
    },
    description: label ? `${label} · bibibigbar` : copy.metaDescription,
    alternates: { canonical: blogOrigin() },
  };
}

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const {
    tag = "",
    category = "",
    destination = "",
    page: pageParam = "1",
    q = "",
  } = await searchParams;
  const locale = await getRequestLocale();
  const copy = getSiteCopy(locale).blog;
  const repository = getBlogRepository();
  const published = await repository.listPublished();
  const home = await blogPath();
  const activeTag = tag.trim();
  const activeCategory = category.trim();
  const activeDestination = destination.trim();
  const query = q.trim();
  const filtered = published.filter((post) => {
    const matchesTag = activeTag ? post.tags.some((item) => item.toLowerCase() === activeTag.toLowerCase()) : true;
    const matchesCategory = activeCategory
      ? post.category.toLowerCase() === activeCategory.toLowerCase()
      : true;
    const matchesDestination = activeDestination
      ? post.destination.toLowerCase() === activeDestination.toLowerCase()
      : true;
    const haystack = `${post.title} ${post.excerpt} ${post.category} ${post.destination} ${post.tags.join(" ")}`.toLowerCase();
    const matchesQuery = query ? haystack.includes(query.toLowerCase()) : true;
    return matchesTag && matchesCategory && matchesDestination && matchesQuery;
  });
  const pageSize = 8;
  const page = Math.max(1, Number(pageParam) || 1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const featured = currentPage === 1 ? visible[0] : undefined;
  const rows = featured ? visible.slice(1) : visible;
  const categories = [...new Set(published.map(categoryLabel).filter(Boolean))].slice(0, 12);

  function hrefFor(
    nextPage: number,
    nextTag = activeTag,
    nextCategory = activeCategory,
    nextDestination = activeDestination,
    nextQuery = query,
  ) {
    const params = new URLSearchParams();
    if (nextTag) params.set("tag", nextTag);
    if (nextCategory) params.set("category", nextCategory);
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
    description: copy.subtitle,
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
          <span>{copy.subtitle}</span>
          <span className="blog-index-count">
            {filtered.length} {filtered.length === 1 ? copy.post : copy.posts}
          </span>
        </div>
      </div>

      <div className="blog-filters">
        <Link href={hrefFor(1, "", "", "", query)} className={`blog-pill ${activeCategory || activeDestination || activeTag ? "" : "is-active"}`}>
          {copy.all}
        </Link>
        {categories.map((item) => {
          const isActive = activeCategory.toLowerCase() === item.toLowerCase();
          return (
            <Link key={item} href={hrefFor(1, "", item, "", query)} className={`blog-pill ${isActive ? "is-active" : ""}`}>
              {item}
            </Link>
          );
        })}
        <form className="blog-search" action={home}>
          {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
          {activeDestination ? <input type="hidden" name="destination" value={activeDestination} /> : null}
          {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
          <input name="q" defaultValue={query} placeholder={copy.search} aria-label={copy.searchAria} />
          <button type="submit" aria-label={copy.search}>
            ⌕
          </button>
        </form>
      </div>

      {activeTag ? (
        <p className="blog-filters">
          {copy.tagged} {activeTag}. <Link href={hrefFor(1, "", activeCategory, activeDestination, query)}>{copy.clearTag}</Link>
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
              <span>{copy.latest}</span>
              <span>
                {[
                  categoryLabel(featured),
                  featured.destination,
                  shortDate(featured.publishedAt, locale),
                  `${featured.readingMinutes} ${copy.min}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </p>
            <h2>{featured.title}</h2>
            <span>{copy.read}</span>
          </div>
        </Link>
      ) : null}

      {rows.map((post) => (
        <Link key={post.id} href={postHref(post)} className="blog-row">
          <span className="blog-row-date">{shortDate(post.publishedAt, locale)}</span>
          <span className="blog-row-title">{post.title}</span>
          <span className="blog-row-label">{[categoryLabel(post), post.destination].filter(Boolean).join(" · ")}</span>
          <span className="blog-row-arrow line-arrow">{"\u2197\uFE0E"}</span>
        </Link>
      ))}

      {!visible.length ? (
        <div className="blog-empty">
          <h2>{copy.emptyTitle}</h2>
          <p>{copy.emptyBody}</p>
        </div>
      ) : null}

      {currentPage < pageCount ? (
        <div className="blog-more">
          <Link href={hrefFor(currentPage + 1)}>{copy.loadMore}</Link>
        </div>
      ) : null}
    </div>
  );
}
