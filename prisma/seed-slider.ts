import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test slider
    const slider = await prisma.slider.create({
      data: {
        title: 'Welcome to Tab.ng',
        subtitle: 'Luxury African Attire for the Modern Man',
        imageUrl: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?q=80&w=1470&auto=format&fit=crop',
        buttonText: 'Shop Collection',
        buttonLink: '/products',
        order: 0,
        isActive: true,
      },
    });

    console.log('Created test slider:', slider);
  } catch (error) {
    console.error('Error creating test slider:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
