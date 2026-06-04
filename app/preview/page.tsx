import ShopClient from "../../components/ShopClient";
import { getProducts, getCategories } from "../../lib/db";
import { getStaticPageMetadata } from "../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = getStaticPageMetadata(
  "Preview",
  "Live preview of the shop page with current product data."
);

export default async function PreviewPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <ShopClient products={products} categories={categories} />
    </div>
  );
}
