import type { Metadata } from "next";
import Link from "next/link";
import { getBlogRepository } from "@/lib/blog";
import { shopPath } from "@/lib/blog/paths";

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
  const allHref = await shopPath();

  return (
    <div>
      <div className="blog-index-hero">
        <h1 className="blog-index-title">
          S<span className="title-mark">h</span>op
        </h1>
        <div className="blog-index-aside">
          <span>Travel gear, linked to Amazon</span>
          <span className="blog-index-count">
            {visible.length} {visible.length === 1 ? "product" : "products"}
          </span>
        </div>
      </div>

      <div className="blog-filters">
        <Link href={allHref} className={`blog-pill ${activeCategory ? "" : "is-active"}`}>
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item}
            href={`${allHref}?category=${encodeURIComponent(item)}`}
            className={`blog-pill ${activeCategory.toLowerCase() === item.toLowerCase() ? "is-active" : ""}`}
          >
            {item}
          </Link>
        ))}
        <span className="shop-note">Opens on Amazon</span>
      </div>

      {visible.length ? (
        <div className="shop-grid">
          {visible.map((product) => (
            <a
              key={product.id}
              href={product.amazonUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="shop-tile"
            >
              <div className="shop-tile-photo">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt="" />
                ) : null}
              </div>
              <div className="shop-tile-meta">
                <h2>{product.name}</h2>
                {product.priceLabel ? <span>{product.priceLabel}</span> : null}
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
