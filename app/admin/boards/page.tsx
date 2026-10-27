import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { createBoardAction, toggleBoardAction } from "@/lib/actions/admin";
import { getAllBoards, getCurrentUser } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Boards" };

export default async function AdminBoardsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/boards");
  if (user.role !== "admin") redirect("/my");

  const boards = await getAllBoards();

  return (
    <div className="container py-12">
      <h1 className="display text-4xl font-bold text-[var(--sky-deep)]">Manage boards</h1>
      <p className="mt-3 text-[var(--muted)]">Add topic boards and activate or deactivate them.</p>
      <div className="mt-8">
        <AdminNav />
      </div>

      <form action={createBoardAction} className="surface mb-8 grid gap-4 rounded-[1.75rem] p-6 md:grid-cols-2">
        <label className="field md:col-span-1">
          <span>Board name</span>
          <input name="name" required placeholder="Neighborhood Events" />
        </label>
        <label className="field md:col-span-1">
          <span>Slug (optional)</span>
          <input name="slug" placeholder="neighborhood-events" />
        </label>
        <label className="field md:col-span-2">
          <span>Description</span>
          <textarea name="description" placeholder="What belongs in this board?" />
        </label>
        <button type="submit" className="btn btn-primary w-fit">
          Add board
        </button>
      </form>

      <div className="surface overflow-x-auto rounded-[1.5rem]">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr key={board.id}>
                <td>
                  <div className="font-semibold">{board.name}</div>
                  <div className="text-sm text-[var(--muted)]">{board.description}</div>
                </td>
                <td>{board.slug}</td>
                <td>{board.isActive ? "Active" : "Inactive"}</td>
                <td>{formatDate(board.createdAt)}</td>
                <td>
                  <form action={toggleBoardAction}>
                    <input type="hidden" name="boardId" value={board.id} />
                    <button type="submit" className="btn btn-secondary !min-h-9 text-sm">
                      {board.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
