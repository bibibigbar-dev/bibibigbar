"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getBlogRepository } from "@/lib/blog";
import { readAmazonUrl, readHttpUrl } from "@/lib/blog/slug";
import type { ShopProduct } from "@/lib/blog/types";

function shopError(message: string, id?: string): never {
  const path = id ? `/admin/shop/${id}` : "/admin/shop";
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function saveShopProductAction(formData: FormData) {
  await requireAdmin();
  const repository = getBlogRepository();
  const id = String(formData.get("id") || "");
  const existing = id ? await repository.getProductById(id) : null;
  const name = String(formData.get("name") || "").trim().slice(0, 140);
  if (!name) shopError("Add a product name.", existing?.id);

  const amazonUrl = readAmazonUrl(String(formData.get("amazonUrl") || ""));
  if (!amazonUrl) shopError("Use an Amazon product URL.", existing?.id);

  const imageValue = String(formData.get("imageUrl") || "");
  const imageUrl = readHttpUrl(imageValue);
  if (imageUrl === null) shopError("Image must be an http or https URL.", existing?.id);

  const now = new Date().toISOString();
  const product: ShopProduct = {
    id: existing?.id || `product-${randomUUID()}`,
    name,
    imageUrl,
    priceLabel: String(formData.get("priceLabel") || "").trim().slice(0, 40),
    category: String(formData.get("category") || "").trim().slice(0, 60),
    amazonUrl,
    isVisible: formData.get("isVisible") === "yes",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await repository.saveProduct(product);
  revalidatePath("/shop");
  revalidatePath("/admin/shop");
  redirect(`/admin/shop/${product.id}?saved=1`);
}

export async function deleteShopProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (id) await getBlogRepository().deleteProduct(id);
  revalidatePath("/shop");
  revalidatePath("/admin/shop");
  redirect("/admin/shop");
}
