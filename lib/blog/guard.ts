import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/queries";

export async function requireAdminPage(nextPath: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  if (user.role !== "admin") redirect("/my");
  return user;
}
