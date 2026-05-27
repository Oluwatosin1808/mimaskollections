"use client";

/* eslint-disable no-unused-vars */

import React, { createContext, useContext, useState } from "react";
import type { Product } from "../lib/types";

type CartItem = { product: Product; quantity: number };

type CartContextValue = {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  emptyCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const cartCount = items.reduce((t, i) => t + i.quantity, 0);
  const cartTotal = items.reduce((t, i) => t + i.product.price * i.quantity, 0);

  function addToCart(product: Product) {
    if (!product.inStock || product.stock <= 0) return;

    setItems((current) => {
      const existing = current.find((it) => it.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return current;
        return current.map((it) =>
          it.product.id === product.id ? { ...it, quantity: Math.min(product.stock, it.quantity + 1) } : it
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, delta: number) {
    setItems((current) =>
      current
        .map((it) =>
          it.product.id === productId
            ? { ...it, quantity: Math.min(it.product.stock, Math.max(0, it.quantity + delta)) }
            : it
        )
        .filter((it) => it.quantity > 0)
    );
  }

  function emptyCart() {
    setItems([]);
  }

  return <CartContext.Provider value={{ items, cartCount, cartTotal, addToCart, updateQuantity, emptyCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
