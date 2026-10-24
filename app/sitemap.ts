import type { MetadataRoute } from "next";
import { blogOrigin, mainOrigin } from "@/lib/blog/config";
import { getBlogRepository } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogRepository().listPublished();
  const blog = blogOrigin();
  const site = mainOrigin();

  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/shop`, changeFrequency: "weekly", priority: 0.7 },
    { url: blog, changeFrequency: "daily", priority: 0.9 },
    ...posts.map((post) => ({
      url: `${blog}/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
