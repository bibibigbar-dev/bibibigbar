import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { getBlogRepository } from "@/lib/blog";
import { getAdminStats, getCurrentUser, getRecentPosts } from "@/lib/queries";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/my");

  const repository = getBlogRepository();
  await repository.promoteScheduled();
  const [stats, recent, journal] = await Promise.all([
    getAdminStats(),
    getRecentPosts(5),
    repository.listPosts(),
  ]);
  const publishedJournal = journal.filter((post) => post.status === "published").length;

  return (
    <div className="container py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sunset)]">
        Admin console
      </p>
      <h1 className="display mt-2 text-4xl font-bold text-[var(--sky-deep)]">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Manage boards, moderate posts, and publish the travel journal. Writing stays on this admin site. Readers see posts on the blog.
      </p>

      <div className="mt-8">
        <AdminNav current="overview" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Users", value: stats.users },
          { label: "Boards", value: stats.boards },
          { label: "Posts", value: stats.posts },
          { label: "Hidden posts", value: stats.hiddenPosts },
          { label: "Journal posts", value: journal.length },
          { label: "Published stories", value: publishedJournal },
        ].map((item) => (
          <div key={item.label} className="surface rounded-[1.5rem] p-5">
            <p className="text-sm text-[var(--muted)]">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-[var(--sky-deep)]">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="display text-2xl font-bold text-[var(--sky-deep)]">Recent posts</h2>
          <div className="flex gap-2">
            <Link href="/admin/blog" className="btn btn-primary">
              Open journal
            </Link>
            <Link href="/admin/posts" className="btn btn-secondary">
              Moderate all
            </Link>
          </div>
        </div>
        <div className="surface overflow-x-auto rounded-[1.5rem]">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Board</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link
                      href={`/boards/${post.board.slug}/${post.id}`}
                      className="font-semibold text-[var(--sky-deep)]"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td>{post.board.name}</td>
                  <td>{post.author.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
