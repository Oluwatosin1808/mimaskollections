import Link from "next/link";

export default function CmsLandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-black/55 p-10 shadow-soft-glow backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">CMS Home</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Manage orders and product uploads separately.
            </h1>
            <p className="mt-4 max-w-3xl text-stone-300">
              Use the dedicated dashboard for orders and the separate upload page for new product creation.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-sm text-stone-300">Choose the workflow you want to manage.</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link href="/cms/orders" className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-8 transition hover:border-gold hover:bg-white/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gold">Orders</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Order dashboard</h2>
                <p className="mt-4 text-stone-300">
                  Review orders, download invoices, update order status, and paginate through recent sales.
                </p>
              </div>
              <span className="rounded-full bg-gold px-3 py-2 text-xs font-semibold text-black">Open</span>
            </div>
          </Link>

          <Link href="/cms/upload" className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-8 transition hover:border-gold hover:bg-white/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gold">Upload</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Product upload</h2>
                <p className="mt-4 text-stone-300">
                  Add new products, upload images, set pricing and stock, and keep your shop catalog fresh.
                </p>
              </div>
              <span className="rounded-full bg-gold px-3 py-2 text-xs font-semibold text-black">Open</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
