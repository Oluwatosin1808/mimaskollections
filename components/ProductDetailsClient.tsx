"use client";

import Link from "next/link";
import type { Product } from "../lib/types";
import { useCart } from "./CartContext";
import { categoryLabels } from "../lib/catalog";

type ProductDetailsClientProps = {
  product: Product | null;
};

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart, items } = useCart();

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-8 text-center shadow-soft">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Product unavailable</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">This item could not be found.</h1>
          <Link href="/shop" className="btn btn-primary mt-6 inline-block">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const cartQuantity = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const remainingStock = Math.max(0, product.stock - cartQuantity);
  const isSoldOut = !product.inStock || remainingStock === 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="mb-6">
        <Link href="/shop" className="text-sm uppercase tracking-[0.25em] text-stone-300 hover:text-gold">
          Back to shop
        </Link>
      </div>

      <section className="grid gap-8 rounded-2xl border border-white/10 bg-black/60 p-6 shadow-soft-glow lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-stone-950">
          <img src={product.image} alt={product.name} className="h-full min-h-[22rem] w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">{categoryLabels[product.category]}</p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">{product.name}</h1>
            <p className="text-base leading-7 text-stone-300">{product.description}</p>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-stone-200 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Price</p>
              <p className="mt-2 text-xl font-semibold text-white">NGN {product.price.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Status</p>
              <p className="mt-2 font-semibold text-white">{isSoldOut ? "Sold out" : "In stock"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Available</p>
              <p className="mt-2 font-semibold text-white">{remainingStock}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={isSoldOut}
            className={`btn w-full sm:w-fit ${isSoldOut ? "btn-disabled" : "btn-primary"}`}
          >
            {isSoldOut ? "Sold out" : "Add to cart"}
          </button>
        </div>
      </section>
    </div>
  );
}
