import { getStaticPageMetadata } from "../../lib/seo";

export const metadata = getStaticPageMetadata(
  "Owo-Flex",
  "Learn how Owo-Flex works and access flexible payment options to buy home essentials without paying the full amount upfront."
);

export default function OwoFlexPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-black/55 p-10 shadow-soft-glow backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-gold">Buy Now. Pay Flexibly.</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Owo-Flex enables customers to access essential products without upfront full payment.
        </h1>
        <p className="mt-6 max-w-3xl text-stone-300">
          Owo-Flex provides a smart way to bring premium home essentials into your life while paying in manageable installments.
        </p>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-white/10 bg-black/55 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">How It Works</h2>
          <ol className="mt-6 space-y-4 text-stone-300">
            {[
              "Choose a product",
              "Apply for Owo-Flex",
              "Get approved",
              "Receive product",
              "Pay in installments"
            ].map((step, index) => (
              <li key={step} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-sm font-semibold text-black">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>
        <article className="rounded-[2rem] border border-white/10 bg-black/55 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">Why Owo-Flex</h2>
          <ul className="mt-6 space-y-4 text-stone-300">
            {[
              "Flexible Payments",
              "Faster Access",
              "Affordable Lifestyle Upgrade",
              "Stress-Free Shopping"
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
                <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
