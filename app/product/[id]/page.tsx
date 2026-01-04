import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category or random)
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: id },
    },
    take: 3,
  });

  return (
    <ProductClient 
      product={{
        ...product,
        createdAt: product.createdAt.toISOString(),
      }}
      relatedProducts={relatedProducts.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
      }))}
    />
  );
}
