"use client";

import { useEffect, useState } from "react";

const reviews = [
  {
    quote: "Fast delivery, quality products, and excellent customer service.",
    name: "Damilola"
  },
  {
    quote: "I finally got what I needed without financial stress.",
    name: "Tosin"
  },
  {
    quote: "Mimaskollections made furnishing my home easy.",
    name: "Jola"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((value) => (value + 1) % reviews.length);
    }, 5200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-14 rounded-2xl border border-white/10 bg-black/55 p-5 shadow-soft-glow backdrop-blur-xl sm:mt-20 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 max-w-2xl sm:mb-10">
          <p className="text-xs uppercase tracking-[0.28em] text-gold sm:text-sm sm:tracking-[0.35em]">Testimonials</p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Customers love the premium feel and flexible payment options.
          </h2>
        </div>
        <div className="relative min-h-[210px] overflow-hidden sm:min-h-[250px]">
          {reviews.map((review, index) => (
            <div
              key={review.name}
              className={`absolute inset-0 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-700 sm:p-8 ${
                index === currentIndex ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
            >
              <p className="text-lg font-semibold leading-8 text-white sm:text-2xl sm:leading-10">{review.quote}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-gold sm:mt-6 sm:text-sm sm:tracking-[0.3em]">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
