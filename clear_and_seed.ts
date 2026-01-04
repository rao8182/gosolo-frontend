import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing existing data...');
  
  // Delete in correct order due to foreign keys
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  
  console.log('✅ Data cleared');
  console.log('🌱 Creating products...');
  
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Energy Boost Gummies',
        description: 'Natural energy gummies with B vitamins',
        price: 599,
        stock: 100,
        imageUrl: '/go-solo-package.png',
      },
      {
        name: 'Sleep Support Gummies',
        description: 'Melatonin-infused gummies for better sleep',
        price: 699,
        stock: 80,
        imageUrl: '/go-solo-package.png',
      },
      {
        name: 'Immunity Boost Gummies',
        description: 'Vitamin C and Zinc gummies',
        price: 549,
        stock: 120,
        imageUrl: '/go-solo-package.png',
      },
      {
        name: 'Focus & Clarity Gummies',
        description: 'Enhanced cognitive function gummies',
        price: 799,
        stock: 60,
        imageUrl: '/go-solo-package.png',
      },
    ],
  });
  
  console.log(`✅ Created ${products.count} products`);
  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
