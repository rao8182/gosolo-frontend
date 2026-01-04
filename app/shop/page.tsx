import { prisma } from "@/lib/prisma";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  // Fetch products on the server
  const products = await prisma.product.findMany({
    take: 100, // Limit to 100 products
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Convert to plain objects and serialize dates
  const serializedProducts = products.map(product => ({
    ...product,
    createdAt: product.createdAt.toISOString()
  }));

  return <ShopClient initialProducts={serializedProducts} />;
}
