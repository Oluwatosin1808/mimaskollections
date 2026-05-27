import CartPageClient from "../../components/CartPage";
import { getStaticPageMetadata } from "../../lib/seo";

export const metadata = getStaticPageMetadata("Cart", "Your shopping cart at Mimaskollections");

export default function CartPage() {
  return <CartPageClient />;
}
