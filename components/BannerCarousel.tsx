"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Curated comfort for every room",
    subtitle: "Upgrade your home with premium essentials in elegant design.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Luxury living, flexible payment",
    subtitle: "Find premium appliances and household products with Owo-Flex.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Inspired gifting for every celebration",
    subtitle: "Discover souvenirs and gift items made for memorable moments.",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80"
  }
];

export default function BannerCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-soft-glow">
      <div className="relative h-[420px] sm:h-[460px]">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
              <p className="text-sm uppercase tracking-[0.35em] text-gold">Shop highlight</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
                {slide.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base text-stone-200 sm:text-lg">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2 w-10 rounded-xl transition ${
              index === active ? "bg-gold" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
