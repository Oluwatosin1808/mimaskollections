import type { Category, Product } from "./types";

export const categories: Category[] = [
  {
    id: "appliances",
    title: "Home Appliances",
    subtitle: "Comfort & efficiency",
    href: "/shop#appliances",
    icon: "*"
  },
  {
    id: "household",
    title: "Household Essentials",
    subtitle: "Everyday living upgrades",
    href: "/shop#household",
    icon: "*"
  },
  {
    id: "souvenirs",
    title: "Souvenirs",
    subtitle: "Events & celebrations",
    href: "/shop#souvenirs",
    icon: "*"
  },
  {
    id: "gifts",
    title: "Gift Items",
    subtitle: "Meaningful gifting",
    href: "/shop#gifts",
    icon: "*"
  }
];

export const products: Product[] = [
  {
    id: "appliance-01",
    name: "Premium Air Fryer",
    description: "Efficient cooking for every kitchen with a luxury matte finish.",
    price: 82500,
    category: "appliances",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001b901?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    stock: 8
  },
  {
    id: "household-01",
    name: "Velvet Bedding Set",
    description: "Soft, premium linens designed for modern comfort.",
    price: 42500,
    category: "household",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    stock: 12
  },
  {
    id: "souvenir-01",
    name: "Luxury Gift Hamper",
    description: "Curated souvenirs for celebrations and memorable moments.",
    price: 31500,
    category: "souvenirs",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    stock: 6
  },
  {
    id: "gifts-01",
    name: "Designer Candle Set",
    description: "A scented gift set crafted for refined living spaces.",
    price: 16300,
    category: "gifts",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    stock: 10
  },
  {
    id: "appliance-02",
    name: "Smart Coffee Maker",
    description: "Convenient brewing with premium espresso results.",
    price: 69500,
    category: "appliances",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    stock: 5
  },
  {
    id: "household-02",
    name: "Signature Kitchen Set",
    description: "Elegant cookware and utensils for seamless meal prep.",
    price: 37900,
    category: "household",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    stock: 9
  }
];
