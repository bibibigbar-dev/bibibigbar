import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/blog/ad-slot";
import { PostShare } from "@/components/blog/post-share";
import { getSessionUser } from "@/lib/auth";
import {
  adsenseClient,
  adsenseSlot,
  blogOrigin,
  canonicalPostUrl,
  mainOrigin,
  shouldIndexBlog,
} from "@/lib/blog/config";
import { getBlogRepository } from "@/lib/blog";
import { blogPath, getBlogMount } from "@/lib/blog/paths";
import type { BlogPost } from "@/lib/blog/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

function categoryLabel(post: BlogPost) {
  const destination = post.destination.trim();
  if (destination && destination !== "-") return destination;
  return post.tags.find((tag) => tag.trim() && tag.trim() !== "-") || "";
}

export async function generateMetadata({ params, searchParams }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const post = await getBlogRepository().getPostBySlug(slug);
  if (!post) return { title: { absolute: "Not found · bibibigbar journal" }, robots: { index: false, follow: false } };

  const mount = await getBlogMount();
  const isPublic = post.status === "published" && preview !== "1";
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = canonicalPostUrl(post.slug);

  return {
    title: { absolute: `${post.title} · bibibigbar journal` },
    description,
    robots: shouldIndexBlog(mount) && isPublic ? { index: true, follow: true } : { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl, alt: post.title }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: BlogPostPageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const repository = getBlogRepository();
  const post = await repository.getPostBySlug(slug);
  if (!post) notFound();

  const wantsPreview = preview === "1";
  if (post.status !== "published") {
    const user = wantsPreview ? await getSessionUser() : null;
    if (!wantsPreview || user?.role !== "admin") notFound();
  }

  const [home, published, mount] = await Promise.all([blogPath(), repository.listPublished(), getBlogMount()]);
  const showAds = mount === "subdomain";
  const recent = published.some((item) => item.id === post.id) ? published : [post, ...published];
  const currentIndex = recent.findIndex((item) => item.id === post.id);
  const nextPost = currentIndex >= 0 ? recent[currentIndex + 1] : undefined;
  const nextHref = nextPost ? await blogPath(nextPost.slug) : "";
  const url = canonicalPostUrl(post.slug);
  const category = categoryLabel(post);
  const meta = [category, post.publishedAt ? formatDate(post.publishedAt) : "", `${post.readingMinutes} min read`]
    .filter(Boolean)
    .join(" · ");
  const tagHrefs = await Promise.all(post.tags.map(async (tag) => ({ tag, href: `${home}?tag=${encodeURIComponent(tag)}` })));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.seoDescription || post.excerpt,
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt,
        inLanguage: "ko",
        mainEntityOfPage: url,
        image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
        keywords: post.tags.join(", "),
        author: { "@type": "Person", name: post.authorName, url: mainOrigin() },
        publisher: { "@type": "Organization", name: "bibibigbar", url: mainOrigin() },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Journal", item: blogOrigin() },
          { "@type": "ListItem", position: 2, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {post.status !== "published" ? <p className="blog-note post-note">Draft preview. This page is not public.</p> : null}
      <div className="post-bar">
        <Link href={home}>← All posts</Link>
        <span>{meta}</span>
      </div>
      <h1 className="post-title">{post.title}</h1>
      <div className="post-cover">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImageUrl} alt="" />
        ) : null}
      </div>
      <div className="post-layout">
        <PostShare url={url} title={post.title} />
        <div>
          {post.excerpt ? <p className="post-lede">{post.excerpt}</p> : null}
          {showAds ? <AdSlot client={adsenseClient()} slot={adsenseSlot("article")} /> : null}
          <div className="blog-prose post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
          {tagHrefs.length ? (
            <div className="post-tags">
              {tagHrefs.map((item) => (
                <Link key={item.tag} href={item.href} className="blog-pill">
                  {item.tag}
                </Link>
              ))}
            </div>
          ) : null}
          {showAds ? <AdSlot client={adsenseClient()} slot={adsenseSlot("feed")} /> : null}
        </div>
      </div>
      {nextPost ? (
        <Link href={nextHref} className="post-next">
          <span>Next post</span>
          <strong>{nextPost.title}</strong>
          <span className="post-next-arrow">→</span>
        </Link>
      ) : null}
    </article>
  );
}
