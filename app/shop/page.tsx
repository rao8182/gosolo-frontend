import { prisma } from "@/lib/prisma";
import ShopClient from "./ShopClient";

// Force dynamic rendering - fetch fresh data on each request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
  // Fetch active products with stock on the server
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      stock: { gt: 0 }
    },
    take: 100,
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Convert to plain objects and serialize dates
  const serializedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    discountPercent: product.discountPercent,
    category: product.category,
    imageUrl: product.imageUrl,
    stock: product.stock,
    createdAt: product.createdAt.toISOString()
  }));

  return <ShopClient initialProducts={serializedProducts} />;
}
