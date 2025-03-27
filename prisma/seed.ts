import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Function to generate slug from a string
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with a single hyphen
}

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user with id: ${admin.id}`);

  // Create categories
  const categories = [
    {
      name: 'Agbada',
      slug: 'agbada',
      description: 'Traditional flowing wide-sleeved robes',
    },
    {
      name: 'Kaftan',
      slug: 'kaftan',
      description: 'Elegant ankle-length garments with long sleeves',
    },
    {
      name: 'Dashiki',
      slug: 'dashiki',
      description: 'Colorful garments that cover the top half of the body',
    },
    {
      name: 'Aso Oke',
      slug: 'aso-oke',
      description: 'Hand-woven cloth created by the Yoruba people',
    },
    {
      name: 'Ankara',
      slug: 'ankara',
      description: 'Vibrant African wax print fabrics',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Traditional caps, beads, and other accessories',
    },
  ];

  const createdCategories = await Promise.all(
    categories.map(async (category) => {
      const created = await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
      console.log(`Created category: ${created.name}`);
      return created;
    })
  );

  // Create products
  const products = [
    {
      name: 'Royal Agbada Set',
      description: 'Luxurious three-piece Agbada set with intricate embroidery, perfect for special occasions.',
      price: 85000,
      inventory: 15,
      images: ['royal-agbada-1.jpg', 'royal-agbada-2.jpg'],
      featured: true,
      isNew: true,
      material: 'Premium cotton blend',
      categoryId: createdCategories.find(c => c.slug === 'agbada')?.id,
    },
    {
      name: 'Embroidered Kaftan',
      description: 'Elegant kaftan with detailed embroidery around the neck and sleeves.',
      price: 45000,
      inventory: 20,
      images: ['embroidered-kaftan-1.jpg', 'embroidered-kaftan-2.jpg'],
      featured: true,
      isNew: false,
      material: 'Cotton',
      categoryId: createdCategories.find(c => c.slug === 'kaftan')?.id,
    },
    {
      name: 'Velvet Agbada',
      description: 'Premium velvet Agbada with gold embroidery for a regal look.',
      price: 95000,
      inventory: 10,
      images: ['velvet-agbada-1.jpg', 'velvet-agbada-2.jpg'],
      featured: true,
      isNew: true,
      material: 'Velvet',
      categoryId: createdCategories.find(c => c.slug === 'agbada')?.id,
    },
    {
      name: 'Classic Kaftan',
      description: 'Timeless kaftan design made from high-quality cotton for everyday wear.',
      price: 35000,
      inventory: 25,
      images: ['classic-kaftan-1.jpg', 'classic-kaftan-2.jpg'],
      featured: false,
      isNew: false,
      material: 'Cotton',
      categoryId: createdCategories.find(c => c.slug === 'kaftan')?.id,
    },
    {
      name: 'Premium Agbada Set',
      description: 'Premium quality Agbada set with detailed hand-stitched embroidery.',
      price: 120000,
      salePrice: 99000,
      inventory: 8,
      images: ['premium-agbada-1.jpg', 'premium-agbada-2.jpg'],
      featured: true,
      isNew: false,
      material: 'Premium cotton blend',
      categoryId: createdCategories.find(c => c.slug === 'agbada')?.id,
    },
    {
      name: 'Luxury Kaftan',
      description: 'Luxury kaftan made from imported silk with subtle embroidery.',
      price: 65000,
      inventory: 12,
      images: ['luxury-kaftan-1.jpg', 'luxury-kaftan-2.jpg'],
      featured: true,
      isNew: true,
      material: 'Silk',
      categoryId: createdCategories.find(c => c.slug === 'kaftan')?.id,
    },
    {
      name: 'Traditional Cap',
      description: 'Handcrafted traditional cap to complement your outfit.',
      price: 15000,
      inventory: 30,
      images: ['traditional-cap-1.jpg', 'traditional-cap-2.jpg'],
      featured: false,
      isNew: false,
      material: 'Woven fabric',
      categoryId: createdCategories.find(c => c.slug === 'accessories')?.id,
    },
    {
      name: 'Beaded Necklace',
      description: 'Handmade beaded necklace with traditional patterns.',
      price: 25000,
      inventory: 15,
      images: ['beaded-necklace-1.jpg', 'beaded-necklace-2.jpg'],
      featured: true,
      isNew: true,
      material: 'Glass beads',
      categoryId: createdCategories.find(c => c.slug === 'accessories')?.id,
    },
    {
      name: 'Colorful Dashiki',
      description: 'Vibrant dashiki shirt with traditional African patterns.',
      price: 28000,
      inventory: 18,
      images: ['colorful-dashiki-1.jpg', 'colorful-dashiki-2.jpg'],
      featured: true,
      isNew: true,
      material: 'Cotton',
      categoryId: createdCategories.find(c => c.slug === 'dashiki')?.id,
    },
    {
      name: 'Premium Aso Oke',
      description: 'Premium quality hand-woven Aso Oke fabric for special occasions.',
      price: 55000,
      inventory: 10,
      images: ['premium-aso-oke-1.jpg', 'premium-aso-oke-2.jpg'],
      featured: true,
      isNew: false,
      material: 'Hand-woven fabric',
      categoryId: createdCategories.find(c => c.slug === 'aso-oke')?.id,
    },
  ];

  await Promise.all(
    products.map(async (product) => {
      if (!product.categoryId) {
        console.warn(`Skipping product ${product.name} due to missing category`);
        return;
      }

      // Generate a slug from the product name
      const slug = generateSlug(product.name);

      const created = await prisma.product.upsert({
        where: { 
          // Use a unique ID based on the product name
          id: `seed-${generateSlug(product.name)}`,
        },
        update: {},
        create: {
          id: `seed-${generateSlug(product.name)}`,
          name: product.name,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          inventory: product.inventory,
          images: product.images,
          featured: product.featured,
          isNew: product.isNew,
          categoryId: product.categoryId,
          slug: slug,
          material: product.material,
        },
      });
      console.log(`Created product: ${created.name} with slug: ${created.slug}`);
    })
  );

  // Create a test customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Test Customer',
      password: customerPassword,
      role: 'USER',
    },
  });
  console.log(`Created customer user with id: ${customer.id}`);

  // Create a test address for the customer
  const address = await prisma.address.upsert({
    where: { 
      id: 'test-address-id',
    },
    update: {},
    create: {
      id: 'test-address-id',
      userId: customer.id,
      type: 'SHIPPING',
      firstName: 'Test',
      lastName: 'Customer',
      address1: '123 Test Street',
      city: 'Lagos',
      state: 'Lagos State',
      postalCode: '100001',
      country: 'Nigeria',
      phone: '+2348012345678',
      isDefault: true,
    },
  });
  console.log(`Created address for customer: ${address.id}`);

  // Create test orders
  const agbadaProduct = await prisma.product.findFirst({
    where: { name: 'Royal Agbada Set' },
  });

  const kaftanProduct = await prisma.product.findFirst({
    where: { name: 'Embroidered Kaftan' },
  });

  if (agbadaProduct && kaftanProduct) {
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'DELIVERED',
        total: 130000,
        shippingFee: 2000,
        tax: 0,
        paymentMethod: 'CARD',
        paymentStatus: 'PAID',
        shippingAddressId: address.id,
        trackingNumber: 'TRK12345678',
        items: {
          create: [
            {
              productId: agbadaProduct.id,
              quantity: 1,
              price: 85000,
            },
            {
              productId: kaftanProduct.id,
              quantity: 1,
              price: 45000,
            },
          ],
        },
      },
    });
    console.log(`Created test order: ${order.id}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
