import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import {
  togglePostHiddenAction,
  togglePostPinnedAction,
} from "@/lib/actions/admin";
import { deletePostAction } from "@/lib/actions/posts";
import { getAllPostsForAdmin, getCurrentUser } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Posts" };

export default async function AdminPostsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/posts");
  if (user.role !== "admin") redirect("/my");

  const posts = await getAllPostsForAdmin();

  return (
    <div className="container py-12">
      <h1 className="display text-4xl font-bold text-[var(--sky-deep)]">Moderate posts</h1>
      <p className="mt-3 text-[var(--muted)]">Pin, hide, or remove posts across every board.</p>
      <div className="mt-8">
        <AdminNav />
      </div>

      <div className="surface overflow-x-auto rounded-[1.5rem]">
        <table className="table">
          <thead>
            <tr>
              <th>Post</th>
              <th>Board</th>
              <th>Author</th>
              <th>Flags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link
                    href={`/boards/${post.board.slug}/${post.id}`}
                    className="font-semibold text-[var(--sky-deep)]"
                  >
                    {post.title}
                  </Link>
                  <div className="text-xs text-[var(--muted)]">{formatDate(post.createdAt)}</div>
                </td>
                <td>{post.board.name}</td>
                <td>{post.author.name}</td>
                <td>
                  {post.isPinned ? "Pinned " : ""}
                  {post.isHidden ? "Hidden" : "Visible"}
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <form action={togglePostPinnedAction}>
                      <input type="hidden" name="postId" value={post.id} />
                      <button type="submit" className="btn btn-secondary !min-h-9 text-sm">
                        {post.isPinned ? "Unpin" : "Pin"}
                      </button>
                    </form>
                    <form action={togglePostHiddenAction}>
                      <input type="hidden" name="postId" value={post.id} />
                      <button type="submit" className="btn btn-secondary !min-h-9 text-sm">
                        {post.isHidden ? "Unhide" : "Hide"}
                      </button>
                    </form>
                    <form action={deletePostAction}>
                      <input type="hidden" name="postId" value={post.id} />
                      <button type="submit" className="btn btn-danger !min-h-9 text-sm">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
