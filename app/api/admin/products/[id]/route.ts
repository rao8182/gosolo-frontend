import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET single product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, product },
      { headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch product", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH update product
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, price, stock, imageUrl, discountPercent, isActive } = body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Build update data (only include provided fields)
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Product name cannot be empty" },
          { status: 400, headers: corsHeaders }
        );
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        return NextResponse.json(
          { success: false, error: "Description must be a string" },
          { status: 400, headers: corsHeaders }
        );
      }
      updateData.description = description.trim();
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price <= 0) {
        return NextResponse.json(
          { success: false, error: "Price must be a positive number" },
          { status: 400, headers: corsHeaders }
        );
      }
      updateData.price = Math.round(price);
    }

    if (stock !== undefined) {
      if (typeof stock !== 'number' || stock < 0) {
        return NextResponse.json(
          { success: false, error: "Stock must be a non-negative number" },
          { status: 400, headers: corsHeaders }
        );
      }
      updateData.stock = Math.round(stock);
    }

    if (imageUrl !== undefined) {
      if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Image URL cannot be empty" },
          { status: 400, headers: corsHeaders }
        );
      }
      updateData.imageUrl = imageUrl.trim();
    }

    if (discountPercent !== undefined) {
      if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100) {
        return NextResponse.json(
          { success: false, error: "Discount must be between 0 and 100" },
          { status: 400, headers: corsHeaders }
        );
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

    return NextResponse.json(
      { success: true, product },
      { headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to update product", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE product (soft delete by setting isActive to false)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // If product has orders, soft delete (set isActive to false)
    if (existingProduct._count.orderItems > 0) {
      const product = await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      return NextResponse.json(
        { success: true, product, message: "Product deactivated (has existing orders)" },
        { headers: corsHeaders }
      );
    }

    // If no orders, hard delete
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Product deleted permanently" },
      { headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to delete product", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
