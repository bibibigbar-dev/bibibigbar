import { AdminNav } from "@/components/admin-nav";
import { AdminShopStudio } from "@/components/admin-shop-studio";
import { requireAdminPage } from "@/lib/blog/guard";
import { getBlogRepository } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop studio" };

interface AdminShopPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminShopPage({ searchParams }: AdminShopPageProps) {
  await requireAdminPage("/admin/shop");
  const { error = "" } = await searchParams;
  const products = await getBlogRepository().listProducts();
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];

  return (
    <div className="container py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sunset)]">Admin</p>
      <h1 className="display mt-2 text-4xl font-bold text-[var(--sky-deep)]">Travel shop</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Products on the shelf. Add one when you need a new Amazon link.
      </p>
      <AdminShopStudio
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          priceLabel: product.priceLabel,
          isVisible: product.isVisible,
        }))}
        categories={categories}
        error={error}
      >
        <AdminNav current="shop" />
      </AdminShopStudio>
    </div>
  );
}
