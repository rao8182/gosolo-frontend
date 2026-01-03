import { prisma } from "@/lib/prisma";
import ShopClient from "./ShopClient.tsx";

export default async function ShopPage() {
  // Fetch products on the server
  const products = await prisma.product.findMany({
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
