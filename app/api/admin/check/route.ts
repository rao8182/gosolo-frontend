import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ isAdmin: false });
    }
    
    const userEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;
    
    const isAdmin = await isAdminEmail(userEmail);
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}
