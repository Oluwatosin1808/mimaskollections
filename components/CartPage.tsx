"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function CartPage() {
  const { items, cartTotal, updateQuantity, emptyCart } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-black/95 p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Checkout cart</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Your selected items</h2>
          </div>
          <button onClick={() => emptyCart()} className="btn btn-secondary px-4 py-2 text-sm">
            Empty cart
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-stone-300">
              Your cart is empty. Add a premium item to continue.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="grid gap-4 rounded-2xl border border-white/10 bg-black/60 p-4 sm:grid-cols-[0.8fr_0.6fr]">
                <div>
                  <p className="font-semibold text-white">{item.product.name}</p>
                  <p className="mt-2 text-sm text-stone-300">{item.product.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                    {item.product.stock - item.quantity} available after this cart
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <p className="text-sm text-stone-300">NGN {item.product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-2">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="rounded-2xl border border-white/10 px-3 py-1 text-sm text-white">
                      -
                    </button>
                    <span className="min-w-[1.5rem] text-center text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="rounded-2xl border border-white/10 px-3 py-1 text-sm text-white">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Order summary</p>
            <p className="mt-2 text-2xl font-semibold text-white">Total: NGN {cartTotal.toLocaleString()}</p>
          </div>
          <Link href="/checkout" className="w-full sm:w-auto">
            <button
              type="button"
              disabled={items.length === 0}
              className={`btn w-full sm:w-auto ${items.length === 0 ? "btn-disabled" : "btn-primary"}`}
            >
              Proceed to checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
