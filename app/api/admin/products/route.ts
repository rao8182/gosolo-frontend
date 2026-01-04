import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET all products (including inactive for admin)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });

    return NextResponse.json(
      { success: true, products },
      { headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch products", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST create new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, stock, imageUrl, discountPercent = 0, isActive = true } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Product name is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { success: false, error: "Product description is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { success: false, error: "Price must be a positive number" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json(
        { success: false, error: "Stock must be a non-negative number" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: "Image URL is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100) {
      return NextResponse.json(
        { success: false, error: "Discount must be between 0 and 100" },
        { status: 400, headers: corsHeaders }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: Math.round(price),
        stock: Math.round(stock),
        imageUrl: imageUrl.trim(),
        discountPercent: Math.round(discountPercent),
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(
      { success: true, product },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to create product", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
