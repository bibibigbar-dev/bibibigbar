import type { Metadata } from "next";
import { TravelMap } from "@/components/travel-map";
import { getBlogRepository } from "@/lib/blog";
import { blogMenuHref } from "@/lib/blog/config";
import { getRequestLocale } from "@/lib/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  if (locale === "ko") {
    return {
      title: "세계 여행 정보 지도",
      description: "세계지도에서 국가를 선택하고 관련 블로그 글과 공식 입국 안내를 확인하세요.",
    };
  }
  return {
    title: "World Travel Map",
    description: "Pick a country on the world map to browse related blog posts and official entry links.",
  };
}

export default async function TravelMapPage() {
  const locale = await getRequestLocale();
  const posts = await getBlogRepository().listPublished();
  const blogBase = blogMenuHref().replace(/\/$/, "");
  const blogPosts = posts
    .filter((post) => post.destination.trim())
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      destination: post.destination,
      publishedAt: post.publishedAt,
      href: `${blogBase}/${post.slug}`,
    }));

  return <TravelMap initialLocale={locale} posts={blogPosts} />;
}
