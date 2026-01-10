import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_CATEGORIES = ["Gummies", "Slim Shake", "Fat Burner"];

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: { select: { orderItems: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, product }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: "Failed to fetch product", details: errorMessage }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, indications, benefits, price, stock, imageUrl, images, discountPercent, isActive, category } = body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404, headers: corsHeaders });
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json({ success: false, error: "Product name cannot be empty" }, { status: 400, headers: corsHeaders });
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return NextResponse.json({ success: false, error: "Description must be a string" }, { status: 400, headers: corsHeaders });
      }
      updateData.description = description.trim();
    }

    if (indications !== undefined) {
      updateData.indications = typeof indications === "string" ? indications.trim() : "";
    }

    if (benefits !== undefined) {
      updateData.benefits = typeof benefits === "string" ? benefits.trim() : "";
    }

    if (price !== undefined) {
      if (typeof price !== "number" || price <= 0) {
        return NextResponse.json({ success: false, error: "Price must be a positive number" }, { status: 400, headers: corsHeaders });
      }
      updateData.price = Math.round(price);
    }

    if (stock !== undefined) {
      if (typeof stock !== "number" || stock < 0) {
        return NextResponse.json({ success: false, error: "Stock must be a non-negative number" }, { status: 400, headers: corsHeaders });
      }
      updateData.stock = Math.round(stock);
    }

    if (category !== undefined) {
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json({ success: false, error: `Category must be one of: ${VALID_CATEGORIES.join(", ")}` }, { status: 400, headers: corsHeaders });
      }
      updateData.category = category;
    }

    if (imageUrl !== undefined) {
      if (typeof imageUrl !== "string" || imageUrl.trim().length === 0) {
        return NextResponse.json({ success: false, error: "Image URL cannot be empty" }, { status: 400, headers: corsHeaders });
      }
      updateData.imageUrl = imageUrl.trim();
    }

    if (images !== undefined) {
      const validImages = Array.isArray(images) ? images.filter((img) => typeof img === "string" && img.length > 0).slice(0, 3) : [];
      updateData.images = validImages;
    }

    if (discountPercent !== undefined) {
      if (typeof discountPercent !== "number" || discountPercent < 0 || discountPercent > 100) {
        return NextResponse.json({ success: false, error: "Discount must be between 0 and 100" }, { status: 400, headers: corsHeaders });
      }
      updateData.discountPercent = Math.round(discountPercent);
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: "Failed to update product", details: errorMessage }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { orderItems: true } } },
    });

    if (!existingProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404, headers: corsHeaders });
    }

    if (existingProduct._count.orderItems > 0) {
      const product = await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, product, message: "Product deactivated (has existing orders)" }, { headers: corsHeaders });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Product deleted permanently" }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: "Failed to delete product", details: errorMessage }, { status: 500, headers: corsHeaders });
  }
}
