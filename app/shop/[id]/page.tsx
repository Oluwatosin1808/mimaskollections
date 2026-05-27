import ProductDetailsClient from "../../../components/ProductDetailsClient";
import { getProductById } from "../../../lib/db";

export default async function ProductDetailsPage({ params }: any) {
  const product = await getProductById(params.id);

  return <ProductDetailsClient product={product} />;
}
