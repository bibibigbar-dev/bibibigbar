"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ShopProductForm } from "@/components/shop/shop-product-form";

interface ShopListProduct {
  id: string;
  name: string;
  category: string;
  priceLabel: string;
  isVisible: boolean;
}

interface AdminShopStudioProps {
  products: ShopListProduct[];
  categories: string[];
  error?: string;
  children: ReactNode;
}

export function AdminShopStudio({ products, categories, error = "", children }: AdminShopStudioProps) {
  const [isOpen, setIsOpen] = useState(Boolean(error));
  const [shown, setShown] = useState(5);
  const visible = products.slice(0, shown);

  return (
    <>
      <div className="mb-8 mt-8">
        <button type="button" className="btn btn-primary" onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? "Close" : "New product"}
        </button>
      </div>
      {children}
      {isOpen ? (
        <div className="mt-6">
          <ShopProductForm product={null} categories={categories} error={error} />
        </div>
      ) : null}
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
            {visible.length ? (
              visible.map((product) => (
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
      {shown < products.length ? (
        <div className="blog-more">
          <button type="button" className="btn btn-secondary" onClick={() => setShown((count) => count + 5)}>
            Load more
          </button>
        </div>
      ) : null}
    </>
  );
}
