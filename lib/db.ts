import { supabase } from "./supabaseClient";
import { categories as staticCategories, products as staticProducts } from "./data";
import { normalizeCategory, normalizeProduct } from "./catalog";
import type { Category, Product } from "./types";

function mapCategory(row: Record<string, unknown>): Category {
  const id = normalizeCategory(String(row.slug ?? row.name ?? row.id ?? "appliances"));
  const title = String(row.name ?? row.title ?? id);
  const subtitle = String(row.subtitle ?? row.description ?? "");
  const href = String(row.href ?? row.link ?? `/shop#${id}`);
  const icon = String(row.icon ?? row.symbol ?? "*");

  return { id, title, subtitle, href, icon };
}

export function mapProduct(row: Record<string, unknown>): Product {
  const id = String(row.id ?? row.slug ?? row.name ?? "product-unknown");
  const name = String(row.name ?? row.title ?? id);
  const description = String(row.description ?? row.details ?? "");
  const price = Number(row.price ?? row.amount ?? 0);
  const category = normalizeCategory(String(row.category ?? row.category_id ?? "appliances"));
  const image = String(
    row.image ?? row.image_url ??
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
  );
  const stockValue = Number(row.stock ?? row.quantity ?? (row.inStock === false ? 0 : 1));
  const inStock = row.inStock === false ? false : stockValue > 0;

  return normalizeProduct({
    id,
    name,
    description,
    price,
    category,
    image,
    stock: stockValue,
    inStock
  });
}

export async function getCategories(): Promise<Category[]> {
  if (!supabase) return staticCategories;

  try {
    const { data, error } = await supabase.from("categories").select("id, name, slug, image_url");
    if (error || !data || data.length === 0) return staticCategories;
    return data.map(mapCategory);
  } catch {
    return staticCategories;
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!supabase) return staticProducts;

  try {
    const { data, error } = await supabase.from("products").select("id, title, description, price, category, image_url, quantity, in_stock");
    if (error || !data || data.length === 0) return staticProducts;
    return data.map(mapProduct);
  } catch {
    return staticProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!supabase) {
    return staticProducts.find((product) => product.id === id) ?? null;
  }

  try {
    const { data, error } = await supabase.from("products").select("id, title, description, price, category, image_url, quantity, in_stock").eq("id", id).limit(1).single();
    if (error || !data) return staticProducts.find((product) => product.id === id) ?? null;
    return mapProduct(data);
  } catch {
    return staticProducts.find((product) => product.id === id) ?? null;
  }
}
