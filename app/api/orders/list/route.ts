import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      take: 100, // Limit to 100 orders
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        payment: {
          select: {
            status: true,
          },
        },
      },
    });

    return NextResponse.json(
      { orders },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500, headers: corsHeaders }
    );
  }
}
