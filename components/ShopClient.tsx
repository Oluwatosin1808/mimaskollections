"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const BannerCarousel = dynamic(() => import("./BannerCarousel"), { ssr: false });
const ProductCard = dynamic(() => import("./ProductCard"), { ssr: false });

import {
  CMS_PRODUCTS_STORAGE_KEY,
  LEGACY_CMS_PRODUCTS_STORAGE_KEY,
  normalizeProduct
} from "../lib/catalog";
import type { Category, Product } from "../lib/types";
import { useCart } from "./CartContext";

type ShopClientProps = {
  products: Product[];
  categories: Category[];
};

function loadCmsProducts() {
  if (typeof window === "undefined") return [];

  const stored =
    window.localStorage.getItem(CMS_PRODUCTS_STORAGE_KEY) ||
    window.localStorage.getItem(LEGACY_CMS_PRODUCTS_STORAGE_KEY);

  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => normalizeProduct(item));
  } catch {
    return [];
  }
}

export default function ShopClient({ products, categories }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cmsProducts, setCmsProducts] = useState<Product[]>([]);
  const { addToCart, items } = useCart();
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    setCmsProducts(loadCmsProducts());
  }, []);

  const categoryOptions = useMemo(() => {
    const availableCategoryIds = new Set<string>(products.map((product) => product.category));
    const baseOptions = [{ value: "all", label: "All Categories" }];

    const mapped = categories.reduce<{ value: string; label: string }[]>((list, category) => {
      if (availableCategoryIds.has(category.id)) {
        list.push({ value: category.id, label: category.title });
        availableCategoryIds.delete(category.id);
      }
      return list;
    }, []);

    const fallbackOptions = Array.from(availableCategoryIds).map((categoryId) => ({
      value: categoryId,
      label: categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
    }));

    return [...baseOptions, ...mapped, ...fallbackOptions];
  }, [categories, products]);

  const allProducts = useMemo(() => [...cmsProducts, ...products], [cmsProducts, products]);

  const filteredProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? allProducts
        : allProducts.filter((product) => product.category === selectedCategory),
    [allProducts, selectedCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const displayedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

  const getCartQuantity = (productId: string) =>
    items.find((item) => item.product.id === productId)?.quantity ?? 0;

  return (
    <div className="space-y-12">
      <BannerCarousel />

      <section className="grid gap-6 rounded-2xl border border-white/10 bg-black/55 p-6 shadow-soft-glow md:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Refine your search</p>
          <h2 className="text-3xl font-semibold text-white">Browse products with clarity and effortless filters.</h2>
          <p className="max-w-2xl text-stone-300">
            Filter by category, open a dedicated details page, and keep your cart ready for checkout.
          </p>
        </div>
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <label className="block text-sm uppercase tracking-[0.35em] text-stone-400" htmlFor="shop-category">
            Category
          </label>
          <select
            id="shop-category"
            aria-label="Select category"
            className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 pr-10 text-white outline-none transition focus:border-gold"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-black text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Featured Collections</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Elegant product discovery for the modern Nigerian home.
            </h2>
          </div>
          <p className="max-w-xl text-stone-300">
            Use the dropdown to filter categories and add premium items to your checkout cart.
          </p>
        </div>
        <div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartQuantity={getCartQuantity(product.id)}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="btn btn-ghost px-3 py-1">Prev</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn btn-ghost px-3 py-1">Next</button>
            </div>
            <div className="text-sm text-stone-400">Page {page} of {totalPages}</div>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-2 py-1 rounded ${page === i + 1 ? 'bg-gold text-black' : 'bg-white/5 text-stone-300'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
