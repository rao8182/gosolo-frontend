import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Valid status transitions: defines which statuses can transition to which
const validTransitions: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        payment: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, order },
      { headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch order", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    // Validate status value
    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if transition is valid
    const allowedNextStatuses = validTransitions[currentOrder.status] || [];
    if (currentOrder.status === status) {
      return NextResponse.json(
        { success: true, message: "Order already has this status", order: currentOrder },
        { headers: corsHeaders }
      );
    }

    if (!allowedNextStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid status transition from ${currentOrder.status} to ${status}`,
          allowedTransitions: allowedNextStatuses
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        payment: true,
      },
    });

    return NextResponse.json(
      { success: true, order },
      { headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to update order", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
