export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "appliances" | "household" | "souvenirs" | "gifts";
  image: string;
  inStock: boolean;
  stock: number;
};

export type Category = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
};
