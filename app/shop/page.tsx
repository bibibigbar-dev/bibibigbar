import type { Metadata } from "next";
import Link from "next/link";
import { getBlogRepository } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Shop · bibibigbar" },
  description: "Travel things worth packing, linked to their Amazon pages.",
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category = "" } = await searchParams;
  const activeCategory = category.trim();
  const products = await getBlogRepository().listVisibleProducts();
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const visible = activeCategory
    ? products.filter((product) => product.category.toLowerCase() === activeCategory.toLowerCase())
    : products;

  return (
    <div className="container py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sunset)]">Shop</p>
      <h1 className="display mt-2 text-5xl font-bold text-[var(--sky-deep)]">Things for the road.</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
        A short list of travel gear. Choosing one opens the product on Amazon.
      </p>

      {categories.length ? (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/shop" className={`blog-chip ${activeCategory ? "" : "is-active"}`}>
            All
          </Link>
          {categories.map((item) => (
            <Link
              key={item}
              href={`/shop?category=${encodeURIComponent(item)}`}
              className={`blog-chip ${activeCategory.toLowerCase() === item.toLowerCase() ? "is-active" : ""}`}
            >
              {item}
            </Link>
          ))}
        </div>
      ) : null}

      {visible.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <a
              key={product.id}
              href={product.amazonUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="shop-card"
            >
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt="" className="shop-card-image" />
              ) : (
                <div className="shop-card-fallback" aria-hidden="true">
                  {product.category || "Shop"}
                </div>
              )}
              <div className="shop-card-body">
                {product.category ? <p className="blog-kicker">{product.category}</p> : null}
                <h2>{product.name}</h2>
                {product.priceLabel ? <p className="shop-price">{product.priceLabel}</p> : null}
                <span>View on Amazon</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="blog-empty">
          <h2>The shelf is empty.</h2>
          <p>Products added in the studio will show up here.</p>
        </div>
      )}
    </div>
  );
}
