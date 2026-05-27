import { getStaticPageMetadata } from "../../lib/seo";

export const metadata = getStaticPageMetadata(
  "About",
  "Learn how Mimaskollections evolved from a WhatsApp business into a trusted Nigerian brand for home essentials and flexible payment solutions."
);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-black/55 p-10 shadow-soft-glow backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-gold">Our Story</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Mimaskollections started with a simple goal: making quality living accessible.
        </h1>
        <div className="mt-8 space-y-6 text-stone-300">
          <p>
            What began as a WhatsApp-based business has grown into a trusted brand serving customers across Nigeria.
          </p>
          <p>
            As demand increased, a key challenge emerged: affordability. This led to Owo-Flex, our flexible payment
            system that allows customers to buy now and pay later without financial pressure.
          </p>
          <p>
            Today, we help families and businesses access quality appliances, household essentials, souvenirs, and gifts
            with ease.
          </p>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-white/10 bg-black/55 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">Vision</h2>
          <p className="mt-5 text-stone-300">
            To become a leading destination for affordable home essentials and flexible lifestyle solutions in Nigeria.
          </p>
        </article>
        <article className="rounded-[2rem] border border-white/10 bg-black/55 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">Mission</h2>
          <p className="mt-5 text-stone-300">
            To make quality living accessible through affordability, convenience, and innovative payment solutions.
          </p>
        </article>
      </section>
    </div>
  );
}
