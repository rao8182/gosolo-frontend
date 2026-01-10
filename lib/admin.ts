import { prisma } from "@/lib/prisma";

// Hardcoded super admins who always have access and cannot be removed
const SUPER_ADMIN_EMAILS = [
  "anjaliy471@gmail.com",
  "contactus.gosolo@gmail.com",
];

export async function isAdminEmail(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if super admin
  if (SUPER_ADMIN_EMAILS.some(e => e.toLowerCase() === normalizedEmail)) {
    return true;
  }
  
  // Check database for admin users
  const adminUser = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail },
  });
  
  return !!adminUser;
}

export async function getAdminUsers() {
  return prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function addAdminUser(email: string, addedBy: string) {
  const normalizedEmail = email.toLowerCase().trim();
  
  return prisma.adminUser.create({
    data: {
      email: normalizedEmail,
      addedBy,
    },
  });
}

export async function removeAdminUser(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Prevent removing super admins
  if (SUPER_ADMIN_EMAILS.some(e => e.toLowerCase() === normalizedEmail)) {
    throw new Error("Cannot remove super admin");
  }
  
  return prisma.adminUser.delete({
    where: { email: normalizedEmail },
  });
}

export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.some(e => e.toLowerCase() === email.toLowerCase().trim());
}

export { SUPER_ADMIN_EMAILS };
