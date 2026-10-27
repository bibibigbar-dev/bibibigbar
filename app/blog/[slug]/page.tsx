import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/blog/ad-slot";
import { PostCard } from "@/components/blog/post-card";
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

function relatedPosts(posts: BlogPost[], current: BlogPost) {
  const others = posts.filter((post) => post.id !== current.id);
  const same = others.filter(
    (post) => current.destination && post.destination.toLowerCase() === current.destination.toLowerCase()
  );
  const sameIds = new Set(same.map((post) => post.id));
  return [...same, ...others.filter((post) => !sameIds.has(post.id))].slice(0, 3);
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
  const hrefFor = async (item: BlogPost) => {
    const path = await blogPath(item.slug);
    return path;
  };
  const related = relatedPosts(published, post);
  const relatedHrefs = await Promise.all(related.map((item) => hrefFor(item)));
  const url = canonicalPostUrl(post.slug);
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
    <article className="container py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {post.status !== "published" ? <p className="blog-note">Draft preview. This page is not public.</p> : null}
      <p className="blog-kicker">
        <Link href={home}>Journal</Link>
        {post.destination ? ` · ${post.destination}` : ""}
      </p>
      <h1 className="display mt-3 max-w-3xl text-5xl font-bold text-[var(--sky-deep)]">{post.title}</h1>
      <p className="mt-4 text-sm text-[var(--muted)]">
        {post.authorName}
        {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
        {` · ${post.readingMinutes} min read`}
      </p>
      {post.excerpt ? <p className="mt-6 max-w-3xl text-xl leading-relaxed text-[var(--ink)]">{post.excerpt}</p> : null}
      {post.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImageUrl} alt={post.title} className="blog-cover" />
      ) : null}
      {showAds ? <AdSlot client={adsenseClient()} slot={adsenseSlot("article")} /> : null}
      <div className="blog-prose blog-article" dangerouslySetInnerHTML={{ __html: post.content }} />
      {tagHrefs.length ? (
        <div className="mt-8 flex flex-wrap gap-2">
          {tagHrefs.map((item) => (
            <Link key={item.tag} href={item.href} className="blog-chip">
              {item.tag}
            </Link>
          ))}
        </div>
      ) : null}
      {showAds ? <AdSlot client={adsenseClient()} slot={adsenseSlot("feed")} /> : null}
      {related.length ? (
        <section className="mt-14">
          <h2 className="display text-3xl font-bold text-[var(--sky-deep)]">Keep reading</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item, index) => (
              <PostCard key={item.id} post={item} href={relatedHrefs[index]} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
