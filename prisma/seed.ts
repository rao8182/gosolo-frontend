import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Check if products already exist
  const existingProducts = await prisma.product.count();
  
  if (existingProducts > 0) {
    console.log(`✅ Database already has ${existingProducts} products. Skipping seed.`);
    return;
  }

  // Create sample products
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
  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
