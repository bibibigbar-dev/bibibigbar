import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { ShopProductForm } from "@/components/shop/shop-product-form";
import { requireAdminPage } from "@/lib/blog/guard";
import { getBlogRepository } from "@/lib/blog";

export const dynamic = "force-dynamic";

interface EditShopProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}

export async function generateMetadata({ params }: EditShopProductPageProps) {
  const { id } = await params;
  const product = await getBlogRepository().getProductById(id);
  return { title: product ? `Edit ${product.name}` : "Edit product" };
}

export default async function EditShopProductPage({ params, searchParams }: EditShopProductPageProps) {
  const { id } = await params;
  const { saved, error = "" } = await searchParams;
  await requireAdminPage(`/admin/shop/${id}`);
  const repository = getBlogRepository();
  const product = await repository.getProductById(id);
  if (!product) notFound();
  const products = await repository.listProducts();
  const categories = [...new Set(products.map((item) => item.category).filter(Boolean))];

  return (
    <div className="container py-12">
      <AdminNav current="shop" />
      <div className="mb-6 flex items-end justify-between gap-3">
        <h1 className="display text-4xl font-bold text-[var(--sky-deep)]">Edit product</h1>
        <Link href="/admin/shop" className="btn btn-secondary">
          All products
        </Link>
      </div>
      <ShopProductForm product={product} categories={categories} saved={saved === "1"} error={error} />
    </div>
  );
}
