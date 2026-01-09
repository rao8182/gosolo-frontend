import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Admin email(s) that have access to /admin routes
const ADMIN_EMAILS = ["anjaliy471@gmail.com"];

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/checkout(.*)",
  "/orders(.*)",
]);

// Admin routes
const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Check admin routes
  if (isAdminRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user is admin
    const userEmail = sessionClaims?.email as string | undefined;
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Check protected routes (checkout, orders)
  if (isProtectedRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
