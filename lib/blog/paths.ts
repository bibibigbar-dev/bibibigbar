import { headers } from "next/headers";

export type BlogMount = "subdomain" | "path";

export async function getBlogMount(): Promise<BlogMount> {
  const headerStore = await headers();
  return headerStore.get("x-bibibig-blog-mount") === "subdomain" ? "subdomain" : "path";
}

export async function blogPath(slug?: string) {
  const mount = await getBlogMount();
  if (!slug) return mount === "subdomain" ? "/" : "/blog";
  return mount === "subdomain" ? `/${slug}` : `/blog/${slug}`;
}
