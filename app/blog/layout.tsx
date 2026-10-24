import type { Metadata } from "next";
import { BlogFooter } from "@/components/blog/blog-footer";
import { BlogHeader } from "@/components/blog/blog-header";
import { blogOrigin, shouldIndexBlog } from "@/lib/blog/config";
import { getBlogMount } from "@/lib/blog/paths";

export async function generateMetadata(): Promise<Metadata> {
  const mount = await getBlogMount();
  const origin = blogOrigin();
  return {
    metadataBase: new URL(origin),
    title: {
      default: "bibibigbar journal",
      template: "%s · bibibigbar journal",
    },
    description: "Travel notes from bibibigbar. Places, meals, and the slow parts of the road.",
    robots: shouldIndexBlog(mount) ? { index: true, follow: true } : { index: false, follow: true },
    alternates: { canonical: origin },
    openGraph: {
      type: "website",
      siteName: "bibibigbar journal",
      title: "bibibigbar journal",
      description: "Travel notes from bibibigbar. Places, meals, and the slow parts of the road.",
      url: origin,
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-shell">
      <a href="#journal" className="skip-link">
        Skip to journal
      </a>
      <BlogHeader />
      <main id="journal" className="flex-1">
        {children}
      </main>
      <BlogFooter />
    </div>
  );
}
