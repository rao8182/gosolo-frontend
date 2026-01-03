import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Add CORS headers for preview environment
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    { message: "Orders API is working. Use POST to create an order." },
    { headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("ORDER BODY RECEIVED:", body);

    const { items, totalAmount } = body;

    // ✅ VALIDATION 1: Check cart is not empty
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ VALIDATION 2: Check totalAmount is valid
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ VALIDATION 3: Verify all product IDs exist in DB and validate prices
    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        price: true,
        stock: true,
        name: true,
      },
    });

    // Check if all products exist
    if (dbProducts.length !== productIds.length) {
      const foundIds = dbProducts.map(p => p.id);
      const missingIds = productIds.filter((id: string) => !foundIds.includes(id));
      return NextResponse.json(
        { error: `Invalid product IDs: ${missingIds.join(", ")}` },
        { status: 400 }
      );
    }

    // Create a map for quick price lookup
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    // Validate prices match database (prevent tampering)
    for (const item of items) {
      const dbProduct = productMap.get(item.id);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product ${item.id} not found` },
          { status: 400 }
        );
      }

      // Check if price matches (allowing for both price and price in rupees)
      if (dbProduct.price !== item.price) {
        console.warn(`Price mismatch for ${item.id}: DB=${dbProduct.price}, Cart=${item.price}`);
        // Use DB price instead of cart price for security
      }

      // Check stock availability
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stock}` },
          { status: 400 }
        );
      }
    }

    // ✅ CREATE ORDER IN TRANSACTION
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: null, // Guest checkout - no auth yet
          status: "PENDING",
          totalAmount: totalAmount,
          items: {
            create: items.map((item: any) => {
              const dbProduct = productMap.get(item.id);
              return {
                productId: item.id,
                quantity: item.quantity,
                price: dbProduct!.price, // Use DB price for security
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      // Optional: Update stock (uncomment if needed)
      // for (const item of items) {
      //   await tx.product.update({
      //     where: { id: item.id },
      //     data: {
      //       stock: {
      //         decrement: item.quantity,
      //       },
      //     },
      //   });
      // }

      return newOrder;
    });

    console.log("✅ ORDER CREATED:", order.id);

    // ✅ RETURN ORDER ID
    return NextResponse.json(
      { orderId: order.id },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error("❌ ORDER API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500, headers: corsHeaders }
    );
  }
}
  