import { prisma } from "@/lib/prisma";

// Hardcoded super admin who always has access
const SUPER_ADMIN_EMAIL = "anjaliy471@gmail.com";

export async function isAdminEmail(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if super admin
  if (normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
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
  
  // Prevent removing super admin
  if (normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error("Cannot remove super admin");
  }
  
  return prisma.adminUser.delete({
    where: { email: normalizedEmail },
  });
}

export { SUPER_ADMIN_EMAIL };
