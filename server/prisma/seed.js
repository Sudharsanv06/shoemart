// server/prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  // Admin user
  const admin = await prisma.user.upsert({
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
    { name: "Nike Air Max 270", brand: "NIKE", category: "RUNNING", gender: "MEN",  price: 8999,  mrp: 11999, sizes: ["7","8","9","10","11"], stock: 50, isFeatured: true, isNew: true,  tags: ["running","air-max","cushion"],     images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"] },
    { name: "Nike Air Force 1",  brand: "NIKE", category: "SNEAKERS", gender: "UNISEX", price: 7499, mrp: 9499, sizes: ["6","7","8","9","10"], stock: 40, isFeatured: true, isNew: false, tags: ["sneakers","classic","white"],      images: ["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600"] },
    { name: "Adidas Ultraboost 22", brand: "ADIDAS", category: "RUNNING", gender: "MEN", price: 12999, mrp: 15999, sizes: ["7","8","9","10","11"], stock: 30, isFeatured: true, isNew: true,  tags: ["boost","running","premium"],    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600"] },
    { name: "Adidas Stan Smith",    brand: "ADIDAS", category: "CASUALS", gender: "UNISEX", price: 6499, mrp: 7999, sizes: ["6","7","8","9","10"], stock: 45, isFeatured: false, isNew: false, tags: ["classic","casual","green"],    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"] },
    { name: "Puma RS-X",           brand: "PUMA", category: "SNEAKERS", gender: "UNISEX", price: 7999, mrp: 9999, sizes: ["6","7","8","9","10","11"], stock: 25, isFeatured: false, isNew: true,  tags: ["retro","chunky","colorful"], images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"] },
    { name: "Puma Softride",       brand: "PUMA", category: "RUNNING",  gender: "MEN",  price: 4999, mrp: 6499, sizes: ["7","8","9","10"],     stock: 60, isFeatured: false, isNew: false, tags: ["soft","comfort","daily"],      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"] },
    { name: "Reebok Classic Leather", brand: "REEBOK", category: "CASUALS", gender: "UNISEX", price: 5999, mrp: 7499, sizes: ["6","7","8","9","10"], stock: 35, isFeatured: false, isNew: false, tags: ["classic","leather","retro"],  images: ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600"] },
    { name: "Skechers D'Lites",    brand: "SKECHERS", category: "CASUALS", gender: "WOMEN", price: 4499, mrp: 5999, sizes: ["4","5","6","7","8"], stock: 40, isFeatured: false, isNew: false, tags: ["chunky","comfort","women"],   images: ["https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600"] },
    { name: "Woodland Hiking Pro", brand: "WOODLAND", category: "BOOTS",  gender: "MEN",  price: 5999, mrp: 7499, sizes: ["7","8","9","10","11"], stock: 20, isFeatured: false, isNew: false, tags: ["outdoor","hiking","rugged"],  images: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600"] },
    { name: "Nike Revolution 6",   brand: "NIKE", category: "RUNNING",  gender: "WOMEN", price: 4499, mrp: 5999, sizes: ["4","5","6","7","8"],  stock: 55, isFeatured: false, isNew: false, tags: ["lightweight","daily","women"], images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600"] },
    { name: "Adidas Duramo Kids",  brand: "ADIDAS", category: "SPORTS",  gender: "KIDS", price: 2999, mrp: 3999, sizes: ["1","2","3","4","5"],  stock: 45, isFeatured: false, isNew: true,  tags: ["kids","sports","school"],     images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"] },
    { name: "Nike Court Vision",   brand: "NIKE", category: "BASKETBALL", gender: "MEN", price: 6999, mrp: 8499, sizes: ["7","8","9","10","11"], stock: 28, isFeatured: true, isNew: false, tags: ["basketball","court","classic"], images: ["https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600"] },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        description: `Premium ${p.name} — crafted for performance and style. ${p.tags.join(", ")}.`,
        // Prisma schema expects strings for `sizes`, `images`, and `tags`.
        sizes: Array.isArray(p.sizes) ? p.sizes.join(",") : p.sizes,
        images: Array.isArray(p.images) ? p.images.join(",") : p.images,
        tags: Array.isArray(p.tags) ? p.tags.join(",") : p.tags,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 200) + 10,
      },
    });
  }

  console.log("✅ Seed complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
