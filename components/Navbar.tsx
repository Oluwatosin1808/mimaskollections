"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Owo-Flex", href: "/owo-flex" },
  { label: "Services", href: "/#services" }
];

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="relative sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-gold/25 bg-gold/10 shadow-soft">
            <Image src="/logo/logo.svg" alt="Mimaskollections logo" fill className="object-contain" />
          </div>
          <span className="sr-only">Mimaskollections</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm uppercase tracking-[0.25em] text-stone-300 transition hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-stone-100 md:hidden"
            aria-label="Open mobile menu"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((open) => !open)}
          >
            <span className="flex h-5 w-5 flex-col justify-between">
              <span className="block h-0.5 w-full bg-white" />
              <span className="block h-0.5 w-full bg-white" />
              <span className="block h-0.5 w-full bg-white" />
            </span>
          </button>

          <Link href="/shop" className="btn btn-secondary-alt hidden md:inline-flex">
            Shop
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-stone-200 hover:bg-white/10 md:h-auto md:w-auto md:px-4 md:py-2"
          >
            <svg className="h-5 w-5 md:hidden" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6h15l-2 8H8L6 3H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
            </svg>
            <span className="hidden text-sm md:inline">Cart</span>
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[0.65rem] font-semibold text-black md:static md:ml-3 md:px-2 md:py-1 md:text-xs">{cartCount}</span>
          </Link>
        </div>
      </div>

      <div className={`${isMobileOpen ? "block" : "hidden"} absolute inset-x-0 top-full z-40 border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden`}>
        <div className="space-y-6 px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-300">Menu</p>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
          <div className="space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.25em] text-stone-200 transition hover:bg-white/10"
                onClick={() => setIsMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="space-y-3">
            <Link href="/shop" className="btn btn-secondary-alt w-full justify-center">
              Shop
            </Link>
            <Link href="/cart" className="btn btn-secondary w-full justify-center">
              Cart {cartCount > 0 ? `(${cartCount})` : ""}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
