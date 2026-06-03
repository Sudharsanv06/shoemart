// server/prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@shoemart.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@shoemart.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "ADMIN",
    },
  });

  // Test user
  await prisma.user.upsert({
    where: { email: "user@shoemart.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@shoemart.com",
      password: await bcrypt.hash("User@123", 10),
      role: "USER",
    },
  });

  // Sample products — one per brand/category combo
  const products = [
    { name: "Nike Air Max 270", brand: "NIKE", category: "RUNNING", gender: "MEN",  price: 8999,  mrp: 11999, sizes: ["7","8","9","10","11"], stock: 50, isFeatured: true, isNew: true,  tags: ["running","air-max","cushion"],     images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145124/shoemart/products/nike-air-max-270.jpg" },
    { name: "Nike Air Force 1",  brand: "NIKE", category: "SNEAKERS", gender: "UNISEX", price: 7499, mrp: 9499, sizes: ["6","7","8","9","10"], stock: 40, isFeatured: true, isNew: false, tags: ["sneakers","classic","white"],      images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145125/shoemart/products/nike-air-force-1.jpg" },
    { name: "Adidas Ultraboost 22", brand: "ADIDAS", category: "RUNNING", gender: "MEN", price: 12999, mrp: 15999, sizes: ["7","8","9","10","11"], stock: 30, isFeatured: true, isNew: true,  tags: ["boost","running","premium"],    images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145126/shoemart/products/adidas-ultraboost.jpg" },
    { name: "Adidas Stan Smith",    brand: "ADIDAS", category: "CASUALS", gender: "UNISEX", price: 6499, mrp: 7999, sizes: ["6","7","8","9","10"], stock: 45, isFeatured: false, isNew: false, tags: ["classic","casual","green"],    images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145127/shoemart/products/adidas-stan-smith.jpg" },
    { name: "Puma RS-X",           brand: "PUMA", category: "SNEAKERS", gender: "UNISEX", price: 7999, mrp: 9999, sizes: ["6","7","8","9","10","11"], stock: 25, isFeatured: false, isNew: true,  tags: ["retro","chunky","colorful"], images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145128/shoemart/products/puma-rsx.jpg" },
    { name: "Puma Softride",       brand: "PUMA", category: "RUNNING",  gender: "MEN",  price: 4999, mrp: 6499, sizes: ["7","8","9","10"],     stock: 60, isFeatured: false, isNew: false, tags: ["soft","comfort","daily"],      images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145164/shoemart/products/puma-softride.jpg" },
    { name: "Reebok Classic Leather", brand: "REEBOK", category: "CASUALS", gender: "UNISEX", price: 5999, mrp: 7499, sizes: ["6","7","8","9","10"], stock: 35, isFeatured: false, isNew: false, tags: ["classic","leather","retro"],  images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145130/shoemart/products/reebok-classic.jpg" },
    { name: "Skechers D'Lites",    brand: "SKECHERS", category: "CASUALS", gender: "WOMEN", price: 4499, mrp: 5999, sizes: ["4","5","6","7","8"], stock: 40, isFeatured: false, isNew: false, tags: ["chunky","comfort","women"],   images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145131/shoemart/products/skechers-dlites.jpg" },
    { name: "Woodland Hiking Pro", brand: "WOODLAND", category: "BOOTS",  gender: "MEN",  price: 5999, mrp: 7499, sizes: ["7","8","9","10","11"], stock: 20, isFeatured: false, isNew: false, tags: ["outdoor","hiking","rugged"],  images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145131/shoemart/products/woodland-hiking.jpg" },
    { name: "Nike Revolution 6",   brand: "NIKE", category: "RUNNING",  gender: "WOMEN", price: 4499, mrp: 5999, sizes: ["4","5","6","7","8"],  stock: 55, isFeatured: false, isNew: false, tags: ["lightweight","daily","women"], images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145132/shoemart/products/nike-revolution-6.jpg" },
    { name: "Adidas Duramo Kids",  brand: "ADIDAS", category: "SPORTS",  gender: "KIDS", price: 2999, mrp: 3999, sizes: ["1","2","3","4","5"],  stock: 45, isFeatured: false, isNew: true,  tags: ["kids","sports","school"],     images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145133/shoemart/products/adidas-duramo-kids.jpg" },
    { name: "Nike Court Vision",   brand: "NIKE", category: "BASKETBALL", gender: "MEN", price: 6999, mrp: 8499, sizes: ["7","8","9","10","11"], stock: 28, isFeatured: true, isNew: false, tags: ["basketball","court","classic"], images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145134/shoemart/products/nike-court-vision.jpg" },
    { name: "Skechers Go Walk",    brand: "SKECHERS", category: "CASUALS", gender: "MEN", price: 3999, mrp: 5499, sizes: ["4","5","6","7","8"], stock: 38, isFeatured: false, isNew: true,  tags: ["walking","comfort","daily"],    images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145135/shoemart/products/skechers-gowalk.jpg" },
    { name: "Woodland Derby",      brand: "WOODLAND", category: "FORMALS", gender: "MEN", price: 6999, mrp: 8499, sizes: ["7","8","9","10","11"], stock: 18, isFeatured: false, isNew: false, tags: ["formal","leather","office"],      images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145136/shoemart/products/woodland-derby.jpg" },
    { name: "Puma Mirage Sport",   brand: "PUMA", category: "SNEAKERS", gender: "WOMEN", price: 8499, mrp: 10499, sizes: ["6","7","8","9","10","11"], stock: 22, isFeatured: true, isNew: true, tags: ["sport","lifestyle","runner"], images: "https://res.cloudinary.com/djf8jtnbe/image/upload/v1780145137/shoemart/products/puma-mirage-sport.jpg" },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        description: `Premium ${p.name} — crafted for performance and style. ${p.tags.join(", ")}.`,
        sizes: Array.isArray(p.sizes) ? p.sizes.join(",") : p.sizes,
        tags: Array.isArray(p.tags) ? p.tags.join(",") : p.tags,
        rating: 0,
        reviewCount: 0,
      },
    });
  }

  console.log("✅ Seed complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
