"use client";

import Link from "next/link";
import { categoryLabels } from "../lib/catalog";
import type { Product } from "../lib/types";

type ProductCardProps = {
  product: Product;
  cartQuantity?: number;
  onAddToCart?: () => void;
};

export default function ProductCard({ product, cartQuantity = 0, onAddToCart }: ProductCardProps) {
  const remainingStock = Math.max(0, product.stock - cartQuantity);
  const isSoldOut = !product.inStock || remainingStock === 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-black/55 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative h-48 md:h-72 overflow-hidden bg-stone-950">
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={product.image}
          alt={product.name}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/20 to-transparent px-5 pb-5 pt-3" />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-2xl bg-gold/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-gold sm:text-xs sm:tracking-[0.3em]">
            {categoryLabels[product.category]}
          </span>
          {isSoldOut ? <span className="text-sm font-semibold text-red-300">Sold out</span> : null}
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white sm:text-xl">{product.name}</h3>
          <p className="text-sm leading-6 text-stone-300">{product.description}</p>
        </div>
        <div className="space-y-3 pt-3">
          <p className="text-lg font-semibold text-white">NGN {product.price.toLocaleString()}</p>
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <Link href={`/shop/${product.id}`} className="btn btn-secondary w-full sm:w-auto min-w-0 px-3 py-2 text-[0.6rem] tracking-[0.16em] sm:px-4 sm:text-[0.68rem]">
              View details
            </Link>
            <button
              type="button"
              onClick={onAddToCart}
              disabled={isSoldOut}
              className={`btn w-full sm:w-auto min-w-0 px-3 py-2 text-[0.6rem] tracking-[0.16em] sm:px-4 sm:text-[0.68rem] ${isSoldOut ? "btn-disabled" : "btn-primary"}`}
            >
              {isSoldOut ? "Sold out" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
