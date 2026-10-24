import Link from "next/link";
import { mainOrigin } from "@/lib/blog/config";
import { blogPath } from "@/lib/blog/paths";

export async function BlogFooter() {
  const home = await blogPath();

  return (
    <footer className="blog-footer">
      <div className="container flex flex-col gap-3 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} bibibigbar journal</p>
        <nav className="flex gap-4 font-semibold">
          <Link href={home}>Journal</Link>
          <a href={mainOrigin()}>bibibigbar.com</a>
        </nav>
      </div>
    </footer>
  );
}
