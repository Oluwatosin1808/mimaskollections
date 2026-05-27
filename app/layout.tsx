import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "../components/CartContext";

export const metadata: Metadata = {
  title: "Mimaskollections | Premium Home Essentials in Nigeria",
  description:
    "Affordable luxury for everyday living. Shop home appliances, household essentials, souvenirs, and gifts with flexible payment on Owo-Flex.",
  metadataBase: new URL("https://mimascollections.ng"),
  openGraph: {
    title: "Mimaskollections",
    description:
      "Affordable luxury for everyday living. Premium home essentials and flexible payment solutions in Nigeria.",
    siteName: "Mimaskollections",
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mimaskollections",
    description:
      "Affordable luxury for everyday living. Premium home essentials and flexible payment solutions in Nigeria."
  }
  ,
  icons: {
    icon: "/logo/logo.svg",
    shortcut: "/logo/logo.svg",
    apple: "/logo/logo.svg"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-ink text-white">
          <CartProvider>
            <Navbar />
            <main className="relative overflow-hidden">{children}</main>
            <Footer />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
