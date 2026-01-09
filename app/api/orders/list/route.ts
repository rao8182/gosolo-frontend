import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Fetch only the current user's orders
    const orders = await prisma.order.findMany({
      where: {
        clerkUserId: userId,
      },
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        payment: {
          select: {
            status: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, orders }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
