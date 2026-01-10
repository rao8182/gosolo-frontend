import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_CATEGORIES = ["Gummies", "Slim Shake", "Fat Burner"];

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    // Check admin access
    const user = await currentUser();
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!user || !(await isAdminEmail(userEmail))) {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403, headers: corsHeaders }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { orderItems: true },
        },
      },
    });

    return NextResponse.json({ success: true, products }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch products", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Check admin access
    const user = await currentUser();
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!user || !(await isAdminEmail(userEmail))) {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { name, description, indications = "", benefits = "", price, stock, imageUrl, images, discountPercent = 0, isActive = true, category } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400, headers: corsHeaders });
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json({ success: false, error: "Product description is required" }, { status: 400, headers: corsHeaders });
    }

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json({ success: false, error: "Price must be a positive number" }, { status: 400, headers: corsHeaders });
    }

    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json({ success: false, error: "Stock must be a non-negative number" }, { status: 400, headers: corsHeaders });
    }

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ success: false, error: "Main image is required" }, { status: 400, headers: corsHeaders });
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ success: false, error: `Category must be one of: ${VALID_CATEGORIES.join(", ")}` }, { status: 400, headers: corsHeaders });
    }

    if (typeof discountPercent !== "number" || discountPercent < 0 || discountPercent > 100) {
      return NextResponse.json({ success: false, error: "Discount must be between 0 and 100" }, { status: 400, headers: corsHeaders });
    }

    // Validate images array
    const validImages = Array.isArray(images) ? images.filter((img) => typeof img === "string" && img.length > 0).slice(0, 3) : [];

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        indications: typeof indications === "string" ? indications.trim() : "",
        benefits: typeof benefits === "string" ? benefits.trim() : "",
        price: Math.round(price),
        stock: Math.round(stock),
        category,
        imageUrl: imageUrl.trim(),
        images: validImages,
        discountPercent: Math.round(discountPercent),
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201, headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to create product", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
