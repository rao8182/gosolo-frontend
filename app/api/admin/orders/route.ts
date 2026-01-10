import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin";

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
    // Check admin access
    const user = await currentUser();
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!user || !(await isAdminEmail(userEmail))) {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403, headers: corsHeaders }
      );
    }

    const orders = await prisma.order.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        payment: {
          select: {
            status: true,
            razorpayPaymentId: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, orders },
      { headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
