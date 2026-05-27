import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black/80">
      <div className="absolute inset-0 opacity-80">
        <Image
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
          alt="Luxury home interior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5 text-white sm:space-y-6">
            <p className="text-xs uppercase tracking-[0.28em] text-gold sm:text-sm sm:tracking-[0.4em]">Elevated living</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl sm:leading-none">
              Discover premium essentials designed for luxury, comfort, and flexible living.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-stone-200 sm:text-lg">
              Shop stylish home appliances, household essentials, souvenirs, and gifts with premium delivery and pay-later ease from Owo-Flex.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/shop" className="btn btn-primary w-full px-8 py-3 sm:w-auto">
                Shop Now
              </Link>
              <Link href="/owo-flex" className="btn btn-secondary w-full sm:w-auto px-8 py-3">
                Explore Owo-Flex
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Quality Products",
                "Flexible Payment Options",
                "Fast Delivery",
                "Affordable Pricing",
                "Trusted Customer Support"
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/5 p-4 text-sm text-stone-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/65 p-5 backdrop-blur-xl sm:p-8">
            <div className="rounded-2xl border border-white/10 bg-black/50 p-5 text-stone-200 sm:p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-gold sm:text-sm sm:tracking-[0.35em]">Featured Story</p>
              <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">Luxury meets convenience with Owo-Flex payments.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 p-5 text-stone-200 sm:p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-gold sm:text-sm sm:tracking-[0.35em]">Fast Delivery</p>
              <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">Nationwide service across Nigeria for premium essentials.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
