"use client";

import Link from "next/link";
import { useState } from "react";

interface RecentPost {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
}

interface RecentProduct {
  id: string;
  name: string;
  priceLabel: string;
  isVisible: boolean;
}

interface AdminRecentProps {
  posts: RecentPost[];
  products: RecentProduct[];
}

export function AdminRecent({ posts, products }: AdminRecentProps) {
  const [tab, setTab] = useState<"blog" | "shop">("blog");
  const [shown, setShown] = useState(5);
  const visiblePosts = posts.slice(0, shown);
  const visibleProducts = products.slice(0, shown);
  const hasMore = tab === "blog" ? shown < posts.length : shown < products.length;

  function selectTab(next: "blog" | "shop") {
    setTab(next);
    setShown(5);
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="display text-2xl font-bold text-[var(--sky-deep)]">Recent</h2>
        <div className="flex gap-2">
          <button type="button" className={`btn !min-h-10 text-sm ${tab === "blog" ? "btn-primary" : "btn-secondary"}`} onClick={() => selectTab("blog")}>
            Blog
          </button>
          <button type="button" className={`btn !min-h-10 text-sm ${tab === "shop" ? "btn-primary" : "btn-secondary"}`} onClick={() => selectTab("shop")}>
            Shop
          </button>
        </div>
      </div>
      <div className="surface overflow-x-auto rounded-[1.5rem]">
        {tab === "blog" ? (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {visiblePosts.length ? (
                visiblePosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Link href={`/admin/blog/${post.id}`} className="font-semibold text-[var(--sky-deep)]">
                        {post.title}
                      </Link>
                    </td>
                    <td className="capitalize">{post.status}</td>
                    <td>{post.updatedAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No blog posts yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Shown</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.length ? (
                visibleProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Link href={`/admin/shop/${product.id}`} className="font-semibold text-[var(--sky-deep)]">
                        {product.name}
                      </Link>
                    </td>
                    <td>{product.priceLabel || "—"}</td>
                    <td>{product.isVisible ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No shop products yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {hasMore ? (
        <div className="blog-more">
          <button type="button" className="btn btn-secondary" onClick={() => setShown((count) => count + 5)}>
            Load more
          </button>
        </div>
      ) : null}
    </section>
  );
}
