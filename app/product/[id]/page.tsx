import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

// Force dynamic rendering - fetch fresh data on each request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Fetch related products (active ones with stock)
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: id },
      isActive: true,
      stock: { gt: 0 }
    },
    take: 3,
  });

  // Combine main image with additional images
  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);

  return (
    <ProductClient 
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        indications: product.indications || "",
        benefits: product.benefits || "",
        price: product.price,
        discountPercent: product.discountPercent,
        imageUrl: product.imageUrl,
        images: allImages,
        stock: product.stock,
        createdAt: product.createdAt.toISOString(),
      }}
      relatedProducts={relatedProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        discountPercent: p.discountPercent,
        imageUrl: p.imageUrl,
        stock: p.stock,
        createdAt: p.createdAt.toISOString(),
      }))}
    />
  );
}
