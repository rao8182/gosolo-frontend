import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth, currentUser } from "@clerk/nextjs/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
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
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to place an order." },
        { status: 401, headers: corsHeaders }
      );
    }

    // Get user details
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unable to retrieve user information." },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check email verification
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );
    
    if (!primaryEmail || primaryEmail.verification?.status !== "verified") {
      return NextResponse.json(
        { error: "Please verify your email address before placing an order." },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { items, totalAmount, paymentMethod = "RAZORPAY" } = body;

    // Validation: Check cart is not empty
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validation: Check each item
    for (const item of items) {
      if (!item.id || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid item: missing id or invalid quantity" },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Validation: Check totalAmount
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify products exist and have stock
    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, stock: true, name: true, discountPercent: true },
    });

    if (dbProducts.length !== productIds.length) {
      const foundIds = dbProducts.map((p) => p.id);
      const missingIds = productIds.filter((id: string) => !foundIds.includes(id));
      return NextResponse.json(
        { error: `Invalid product IDs: ${missingIds.join(", ")}` },
        { status: 400, headers: corsHeaders }
      );
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Validate stock
    for (const item of items) {
      const dbProduct = productMap.get(item.id);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product ${item.id} not found` },
          { status: 400, headers: corsHeaders }
        );
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stock}` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Calculate actual total with discounts
    let calculatedTotal = 0;
    for (const item of items) {
      const dbProduct = productMap.get(item.id)!;
      const discountedPrice = Math.round(dbProduct.price * (1 - dbProduct.discountPercent / 100));
      calculatedTotal += discountedPrice * item.quantity;
    }

    // Handle COD orders
    if (paymentMethod === "COD") {
      const order = await prisma.$transaction(async (tx) => {
        // Deduct stock for COD orders
        for (const item of items) {
          await tx.product.update({
            where: { id: item.id },
            data: { stock: { decrement: item.quantity } },
          });
        }

        const newOrder = await tx.order.create({
          data: {
            clerkUserId: userId,
            userEmail: primaryEmail.emailAddress,
            status: "PENDING",
            totalAmount: calculatedTotal,
            items: {
              create: items.map((item: any) => {
                const dbProduct = productMap.get(item.id)!;
                const discountedPrice = Math.round(dbProduct.price * (1 - dbProduct.discountPercent / 100));
                return {
                  productId: item.id,
                  quantity: item.quantity,
                  price: discountedPrice,
                };
              }),
            },
          },
          include: { items: true },
        });

        await tx.payment.create({
          data: {
            orderId: newOrder.id,
            amount: calculatedTotal,
            currency: "INR",
            status: "COD_PENDING",
            provider: "COD",
            razorpayOrderId: `COD_${Date.now()}`,
          },
        });

        return newOrder;
      });

      return NextResponse.json(
        {
          orderId: order.id,
          paymentMethod: "COD",
          amount: calculatedTotal,
          currency: "INR",
        },
        { status: 201, headers: corsHeaders }
      );
    }

    // Create Razorpay order for online payments
    const razorpayOrder = await razorpay.orders.create({
      amount: calculatedTotal * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          clerkUserId: userId,
          userEmail: primaryEmail.emailAddress,
          status: "PENDING",
          totalAmount: calculatedTotal,
          items: {
            create: items.map((item: any) => {
              const dbProduct = productMap.get(item.id)!;
              const discountedPrice = Math.round(dbProduct.price * (1 - dbProduct.discountPercent / 100));
              return {
                productId: item.id,
                quantity: item.quantity,
                price: discountedPrice,
              };
            }),
          },
        },
        include: { items: true },
      });

      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: calculatedTotal,
          currency: "INR",
          status: "PENDING",
          provider: "RAZORPAY",
          razorpayOrderId: razorpayOrder.id,
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: calculatedTotal,
        currency: "INR",
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create order. Please try again.", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
