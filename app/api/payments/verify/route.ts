import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

// Add CORS headers for preview environment
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { error: "Missing required payment details" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ VERIFY RAZORPAY SIGNATURE
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ UPDATE PAYMENT, ORDER STATUS, AND REDUCE STOCK IN TRANSACTION
    await prisma.$transaction(async (tx) => {
      // Update Payment record
      await tx.payment.updateMany({
        where: {
          orderId: orderId,
          razorpayOrderId: razorpay_order_id,
        },
        data: {
          status: "COMPLETED",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });

      // Update Order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });

      // Reduce product stock - OPTIMIZED: Batch updates using Promise.all
      const orderItems = await tx.orderItem.findMany({
        where: { orderId },
        select: {
          productId: true,
          quantity: true,
        },
      });

      // Batch all stock updates in parallel to avoid N+1 queries
      await Promise.all(
        orderItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        )
      );
    });

    return NextResponse.json(
      { success: true, orderId },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500, headers: corsHeaders }
    );
  }
}
