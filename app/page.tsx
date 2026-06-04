import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import Testimonials from "../components/Testimonials";
import { getHomepageMetadata } from "../lib/seo";
import { getCategories } from "../lib/db";

export const dynamic = "force-dynamic";

export const metadata = getHomepageMetadata();

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <section className="mt-14 rounded-3xl border border-white/5 bg-white/5 p-8 shadow-soft-glow backdrop-blur-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your Trusted Store for Home Essentials & Lifestyle Products
          </h2>
          <p className="mt-4 max-w-3xl text-base text-stone-200 sm:text-lg">
            Mimaskollections helps individuals and families access premium everyday essentials with ease,
            affordability, and convenience.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Affordable Luxury Without Compromise",
              "Carefully Curated Quality Products",
              "Flexible Payments via Owo-Flex",
              "Fast Nationwide Delivery",
              "Seamless Shopping Experience"
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-black/60 p-6 shadow-soft">
                <p className="text-base leading-7 text-stone-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-gold">Featured Categories</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Discover premium categories designed for modern living.
              </h2>
            </div>
            <p className="max-w-xl text-base text-stone-300">
              Appliances, household essentials, souvenirs, and gift items curated for comfort, style, and value.
            </p>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-black/60 p-8 shadow-soft backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">Why choose Mimaskollections?</h2>
            <ul className="mt-6 space-y-4 text-stone-200">
              {[
                "Premium essentials curated for comfort and affordability.",
                "Simplified shopping with nationwide delivery.",
                "Flexible financing options that reduce upfront costs.",
                "A refined marketplace experience inspired by premium retail.",
                "Trusted customer care for every order."
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft-glow backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white">Trusted Value Driver</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Quality Products",
                "Flexible Payment Options",
                "Fast Delivery",
                "Affordable Pricing",
                "Trusted Customer Support"
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-black/60 p-5 text-sm text-stone-200">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section id="services" className="mt-16 rounded-[2rem] border border-white/10 bg-black/55 p-10 shadow-soft-glow backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Services</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Crafted solutions for your home and lifestyle needs.
          </h2>
          <p className="mt-6 max-w-3xl text-stone-300">
            Mimaskollections provides carefully curated products and financing options designed to make quality living
            accessible.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Home Appliances",
              "Household Essentials",
              "Souvenirs",
              "Gift Items",
              "Owo-Flex Financing"
            ].map((service) => (
              <article
                key={service}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-stone-200 shadow-soft transition hover:-translate-y-1 hover:border-gold/50"
              >
                <h3 className="text-xl font-semibold text-white">{service}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-300">
                  {service === "Owo-Flex Financing"
                    ? "Access flexible installments for premium home essentials."
                    : "Premium products selected to elevate comfort, style, and everyday convenience."}
                </p>
              </article>
            ))}
          </div>
        </section>

        <Testimonials />
      </div>
    </>
  );
}
