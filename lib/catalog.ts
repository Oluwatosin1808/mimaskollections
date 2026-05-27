import type { Product } from "./types";

export const CMS_PRODUCTS_STORAGE_KEY = "mimaskollections-cms-products";
export const LEGACY_CMS_PRODUCTS_STORAGE_KEY = "mima-cms-items";

export const categoryLabels: Record<Product["category"], string> = {
  appliances: "Home Appliances",
  household: "Household Essentials",
  souvenirs: "Souvenirs",
  gifts: "Gift Items"
};

export function normalizeCategory(value: string): Product["category"] {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("appliance")) return "appliances";
  if (normalized.includes("household")) return "household";
  if (normalized.includes("souvenir")) return "souvenirs";
  if (normalized.includes("gift")) return "gifts";

  return "appliances";
}

export function normalizeProduct(product: Partial<Product> & { id: string; name: string }): Product {
  const stock = Number(product.stock ?? (product.inStock === false ? 0 : 1));

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    category: normalizeCategory(product.category ?? "appliances"),
    image:
      product.image ||
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    stock: Math.max(0, stock),
    inStock: stock > 0
  };
}
