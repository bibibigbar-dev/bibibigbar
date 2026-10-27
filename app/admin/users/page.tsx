import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { setUserRoleAction } from "@/lib/actions/admin";
import { getAllUsersForAdmin, getCurrentUser } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Users" };

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/users");
  if (user.role !== "admin") redirect("/my");

  const users = await getAllUsersForAdmin();

  return (
    <div className="container py-12">
      <h1 className="display text-4xl font-bold text-[var(--sky-deep)]">Manage users</h1>
      <p className="mt-3 text-[var(--muted)]">Review members and switch roles between user and admin.</p>
      <div className="mt-8">
        <AdminNav />
      </div>

      <div className="surface overflow-x-auto rounded-[1.5rem]">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Change role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((member) => (
              <tr key={member.id}>
                <td className="font-semibold">{member.name}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>{formatDate(member.createdAt)}</td>
                <td>
                  <form action={setUserRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={member.id} />
                    <select
                      name="role"
                      defaultValue={member.role}
                      className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    <button type="submit" className="btn btn-secondary !min-h-9 text-sm">
                      Save
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
