import { AdminNav } from "@/components/admin-nav";
import { AdminRecent } from "@/components/admin-recent";
import { getBlogRepository } from "@/lib/blog";
import { getCurrentUser } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/my");

  const repository = getBlogRepository();
  await repository.promoteScheduled();
  const [journal, products] = await Promise.all([repository.listPosts(), repository.listProducts()]);
  const recentPosts = [...journal]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((post) => ({
      id: post.id,
      title: post.title,
      status: post.status,
      updatedAt: formatDateTime(post.updatedAt),
    }));
  const recentProducts = [...products]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((product) => ({
      id: product.id,
      name: product.name,
      priceLabel: product.priceLabel,
      isVisible: product.isVisible,
    }));
  const counts = [
    { label: "Published", value: journal.filter((post) => post.status === "published").length },
    { label: "Drafts", value: journal.filter((post) => post.status === "draft").length },
    { label: "Scheduled", value: journal.filter((post) => post.status === "scheduled").length },
    { label: "Shop", value: products.length },
  ];

  return (
    <div className="container py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sunset)]">Admin console</p>
      <h1 className="display mt-2 text-4xl font-bold text-[var(--sky-deep)]">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">Recent blog posts and shop products.</p>

      <div className="mt-8">
        <AdminNav current="overview" />
      </div>

      <div className="admin-stats">
        {counts.map((item) => (
          <div key={item.label} className="admin-stat">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <AdminRecent posts={recentPosts} products={recentProducts} />
    </div>
  );
}
