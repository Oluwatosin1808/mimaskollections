import Link from "next/link";
import type { Category } from "../lib/types";

type CategoryGridProps = {
  categories: Category[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={category.href ?? `/shop#${category.id}`}
          className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 transition hover:-translate-y-1 hover:border-gold/50"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-gold">{category.title}</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">{category.title}</h3>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gold/10 text-gold text-lg">
              {category.icon ?? "★"}
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-stone-300">{category.subtitle}</p>
        </Link>
      ))}
    </div>
  );
}
