import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import { blogOrigin, blogSetupChecks, readablePostUrl } from "@/lib/blog/config";
import { requireAdminPage } from "@/lib/blog/guard";
import { getBlogRepository } from "@/lib/blog";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog studio" };

export default async function AdminBlogPage() {
  await requireAdminPage("/admin/blog");
  const repository = getBlogRepository();
  await repository.promoteScheduled();
  const [posts, topics] = await Promise.all([repository.listPosts(), repository.listTopics()]);
  const checks = blogSetupChecks();
  const queued = topics.filter((topic) => topic.status === "queued").length;

  return (
    <div className="container py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sunset)]">Admin</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl font-bold text-[var(--sky-deep)]">Travel journal</h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Write here, then publish to {blogOrigin()}. Readers never see drafts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/blog/topics" className="btn btn-secondary">
            Topic queue ({queued})
          </Link>
          <Link href="/admin/blog/new" className="btn btn-primary">
            New post
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminNav current="blog" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {checks.map((check) => (
          <div key={check.label} className="surface rounded-[1.25rem] p-4">
            <p className="text-sm font-semibold text-[var(--sky-deep)]">{check.label}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{check.detail}</p>
          </div>
        ))}
      </div>

      <div className="surface mt-8 overflow-x-auto rounded-[1.5rem]">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {posts.length ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/blog/${post.id}`} className="font-semibold text-[var(--sky-deep)]">
                      {post.title}
                    </Link>
                    <p className="text-xs text-[var(--muted)]">
                      <a href={readablePostUrl(post.status, post.slug)}>
                        {post.status === "published" ? "Open on the journal" : "Preview draft"}
                      </a>
                    </p>
                  </td>
                  <td className="capitalize">{post.status}</td>
                  <td>{formatDateTime(post.updatedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No posts yet. Write one, or queue a travel topic for the AI writer.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
