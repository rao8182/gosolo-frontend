import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdminEmail, getAdminUsers, addAdminUser, removeAdminUser, SUPER_ADMIN_EMAIL } from "@/lib/admin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
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

    const adminUsers = await getAdminUsers();
    
    return NextResponse.json({ 
      success: true, 
      adminUsers,
      superAdminEmail: SUPER_ADMIN_EMAIL,
    }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin users", details: errorMessage },
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
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if already an admin
    if (await isAdminEmail(email)) {
      return NextResponse.json(
        { success: false, error: "User is already an admin" },
        { status: 400, headers: corsHeaders }
      );
    }

    const newAdmin = await addAdminUser(email, userEmail || "unknown");
    
    return NextResponse.json({ 
      success: true, 
      message: `${email} has been added as admin`,
      adminUser: newAdmin,
    }, { status: 201, headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to add admin user", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: Request) {
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
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Prevent removing super admin
    if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "Cannot remove super admin" },
        { status: 400, headers: corsHeaders }
      );
    }

    await removeAdminUser(email);
    
    return NextResponse.json({ 
      success: true, 
      message: `${email} has been removed from admins`,
    }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to remove admin user", details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
