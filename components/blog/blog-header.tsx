import Link from "next/link";
import { adminBlogHref, mainOrigin } from "@/lib/blog/config";
import { blogPath } from "@/lib/blog/paths";

export async function BlogHeader() {
  const home = await blogPath();
  const studio = adminBlogHref();
  const main = mainOrigin();

  return (
    <header className="blog-header">
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link href={home} className="blog-wordmark">
          bibibigbar <span>journal</span>
        </Link>
        <nav aria-label="Journal" className="flex items-center gap-5 text-sm font-semibold">
          <Link href={home}>Journal</Link>
          <a href={main}>Main site</a>
          <a href={studio}>Studio</a>
        </nav>
      </div>
    </header>
  );
}
