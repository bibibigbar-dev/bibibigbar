import Link from "next/link";
import { AdminBlogList } from "@/components/admin-blog-list";
import { AdminNav } from "@/components/admin-nav";
import { blogOrigin, readablePostUrl } from "@/lib/blog/config";
import { requireAdminPage } from "@/lib/blog/guard";
import { getBlogRepository } from "@/lib/blog";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog studio" };

export default async function AdminBlogPage() {
  await requireAdminPage("/admin/blog");
  const repository = getBlogRepository();
  await repository.promoteScheduled();
  const posts = [...(await repository.listPosts())].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="container py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sunset)]">Admin</p>
      <h1 className="display mt-2 text-4xl font-bold text-[var(--sky-deep)]">Travel journal</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Write here, then publish to {blogOrigin()}. Readers never see drafts.
      </p>

      <div className="mb-8 mt-8">
        <Link href="/admin/blog/new" className="btn btn-primary">
          New post
        </Link>
      </div>
      <AdminNav current="blog" />

      <AdminBlogList
        posts={posts.map((post) => ({
          id: post.id,
          title: post.title,
          status: post.status,
          updatedAt: formatDateTime(post.updatedAt),
          previewHref: readablePostUrl(post.status, post.slug),
          previewLabel: post.status === "published" ? "Open on the journal" : "Preview draft",
        }))}
      />
    </div>
  );
}
