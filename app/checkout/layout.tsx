import { getStaticPageMetadata } from "../../lib/seo";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = getStaticPageMetadata(
  "Checkout",
  "Enter your delivery details and confirm payment for your order."
);

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
