import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Owo-Flex", href: "/owo-flex" },
  { label: "Services", href: "/#services" }
];

const serviceHighlights = [
  "Home appliances",
  "Household essentials",
  "Souvenirs",
  "Gift items",
  "Owo-Flex payments"
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/70 py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gold/25 bg-gold/10 shadow-soft">
                <Image src="/logo/logo.svg" alt="Mimaskollections logo" fill className="object-contain" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gold">Mimaskollections</p>
                <p className="mt-1 text-sm text-stone-400">Premium lifestyle essentials</p>
              </div>
            </div>
            <h2 className="mt-7 text-3xl font-semibold text-white">Ready to upgrade your home and lifestyle?</h2>
            <p className="mt-4 max-w-xl text-stone-300">
              Shop curated home appliances, household essentials, souvenirs, and gift items with convenient access to
              flexible Owo-Flex payment options.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary w-full sm:w-auto px-5 py-3 text-xs">
                Shop Now
              </Link>
              <Link href="/owo-flex" className="btn btn-secondary w-full sm:w-auto px-5 py-3 text-xs">
                Explore Owo-Flex
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">Quick Links</p>
            <div className="grid gap-3">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-stone-300 transition hover:text-gold">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-gold">What We Offer</p>
            <div className="space-y-3">
              {serviceHighlights.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Mimaskollections. Premium lifestyle essentials for Nigeria.</p>
          <p>Affordable luxury. Flexible payment. Trusted delivery.</p>
        </div>
      </div>
    </footer>
  );
}
