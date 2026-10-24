import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import { ShopProductForm } from "@/components/shop/shop-product-form";
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
        Add a product with its Amazon page. Hidden products stay off the public shelf.
      </p>
      <div className="mt-8">
        <AdminNav current="shop" />
      </div>
      <ShopProductForm product={null} categories={categories} error={error} />
      <div className="surface mt-8 overflow-x-auto rounded-[1.5rem]">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Shown</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link href={`/admin/shop/${product.id}`} className="font-semibold text-[var(--sky-deep)]">
                      {product.name}
                    </Link>
                  </td>
                  <td>{product.category || "—"}</td>
                  <td>{product.priceLabel || "—"}</td>
                  <td>{product.isVisible ? "Yes" : "No"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No products yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
