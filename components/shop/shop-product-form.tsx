"use client";

import { deleteShopProductAction, saveShopProductAction } from "@/lib/actions/shop";
import type { ShopProduct } from "@/lib/blog/types";

interface ShopProductFormProps {
  product: ShopProduct | null;
  categories: string[];
  saved?: boolean;
  error?: string;
}

export function ShopProductForm({ product, categories, saved = false, error = "" }: ShopProductFormProps) {
  return (
    <div>
      {saved ? <p className="blog-note">Saved.</p> : null}
      {error ? <p className="blog-error">{error}</p> : null}
      <form action={saveShopProductAction} className="surface grid gap-4 rounded-[1.5rem] p-5 md:grid-cols-2">
        <input type="hidden" name="id" value={product?.id || ""} />
        <label className="field">
          <span>Product name</span>
          <input name="name" required defaultValue={product?.name || ""} placeholder="Packing cube set" />
        </label>
        <label className="field">
          <span>Category</span>
          <input name="category" list="shop-categories" defaultValue={product?.category || ""} placeholder="Bags" />
          <datalist id="shop-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>
        <label className="field">
          <span>Price</span>
          <input name="priceLabel" defaultValue={product?.priceLabel || ""} placeholder="$24" />
        </label>
        <label className="field">
          <span>Image URL</span>
          <input name="imageUrl" defaultValue={product?.imageUrl || ""} placeholder="https://" />
        </label>
        <label className="field md:col-span-2">
          <span>Amazon URL</span>
          <input name="amazonUrl" required defaultValue={product?.amazonUrl || ""} placeholder="https://www.amazon.com/dp/..." />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="isVisible" value="yes" defaultChecked={product ? product.isVisible : true} />
          Show on the shop
        </label>
        <button type="submit" className="btn btn-primary md:col-span-2">
          Save product
        </button>
      </form>
      {product ? (
        <form action={deleteShopProductAction} className="mt-4">
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="btn btn-danger"
            onClick={(event) => {
              if (!window.confirm("Delete this product?")) event.preventDefault();
            }}
          >
            Delete product
          </button>
        </form>
      ) : null}
    </div>
  );
}
