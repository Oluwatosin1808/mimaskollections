import ShopClient from "../../components/ShopClient";
import { getProducts, getCategories } from "../../lib/db";
import { getStaticPageMetadata } from "../../lib/seo";

export const metadata = getStaticPageMetadata(
  "Shop",
  "Shop by category for premium home appliances, household essentials, souvenirs, and gift items from Mimaskollections."
);

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <ShopClient products={products} categories={categories} />
    </div>
  );
}
