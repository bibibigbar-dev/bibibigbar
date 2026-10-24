import type { MetadataRoute } from "next";
import { blogOrigin } from "@/lib/blog/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/my", "/api", "/login", "/register"],
    },
    sitemap: `${blogOrigin()}/sitemap.xml`,
  };
}
