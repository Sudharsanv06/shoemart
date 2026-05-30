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
    { name: "Nike Air Max 270", brand: "NIKE", category: "RUNNING", gender: "MEN",  price: 8999,  mrp: 11999, sizes: ["7","8","9","10","11"], stock: 50, isFeatured: true, isNew: true,  tags: ["running","air-max","cushion"],     images: "https://i.imgur.com/2nCt3Sbl.jpg" },
    { name: "Nike Air Force 1",  brand: "NIKE", category: "SNEAKERS", gender: "UNISEX", price: 7499, mrp: 9499, sizes: ["6","7","8","9","10"], stock: 40, isFeatured: true, isNew: false, tags: ["sneakers","classic","white"],      images: "https://i.imgur.com/ZANVnHE.jpg" },
    { name: "Adidas Ultraboost 22", brand: "ADIDAS", category: "RUNNING", gender: "MEN", price: 12999, mrp: 15999, sizes: ["7","8","9","10","11"], stock: 30, isFeatured: true, isNew: true,  tags: ["boost","running","premium"],    images: "https://i.imgur.com/Oxs5cLp.jpg" },
    { name: "Adidas Stan Smith",    brand: "ADIDAS", category: "CASUALS", gender: "UNISEX", price: 6499, mrp: 7999, sizes: ["6","7","8","9","10"], stock: 45, isFeatured: false, isNew: false, tags: ["classic","casual","green"],    images: "https://i.imgur.com/k2NXnZH.jpg" },
    { name: "Puma RS-X",           brand: "PUMA", category: "SNEAKERS", gender: "UNISEX", price: 7999, mrp: 9999, sizes: ["6","7","8","9","10","11"], stock: 25, isFeatured: false, isNew: true,  tags: ["retro","chunky","colorful"], images: "https://i.imgur.com/WbBgoCb.jpg" },
    { name: "Puma Softride",       brand: "PUMA", category: "RUNNING",  gender: "MEN",  price: 4999, mrp: 6499, sizes: ["7","8","9","10"],     stock: 60, isFeatured: false, isNew: false, tags: ["soft","comfort","daily"],      images: "https://i.imgur.com/1krSMBz.jpg" },
    { name: "Reebok Classic Leather", brand: "REEBOK", category: "CASUALS", gender: "UNISEX", price: 5999, mrp: 7499, sizes: ["6","7","8","9","10"], stock: 35, isFeatured: false, isNew: false, tags: ["classic","leather","retro"],  images: "https://i.imgur.com/Qcql3tG.jpg" },
    { name: "Skechers D'Lites",    brand: "SKECHERS", category: "CASUALS", gender: "WOMEN", price: 4499, mrp: 5999, sizes: ["4","5","6","7","8"], stock: 40, isFeatured: false, isNew: false, tags: ["chunky","comfort","women"],   images: "https://i.imgur.com/1P4EIcm.jpg" },
    { name: "Woodland Hiking Pro", brand: "WOODLAND", category: "BOOTS",  gender: "MEN",  price: 5999, mrp: 7499, sizes: ["7","8","9","10","11"], stock: 20, isFeatured: false, isNew: false, tags: ["outdoor","hiking","rugged"],  images: "https://i.imgur.com/5yOHBDm.jpg" },
    { name: "Nike Revolution 6",   brand: "NIKE", category: "RUNNING",  gender: "WOMEN", price: 4499, mrp: 5999, sizes: ["4","5","6","7","8"],  stock: 55, isFeatured: false, isNew: false, tags: ["lightweight","daily","women"], images: "https://i.imgur.com/AjNjPvD.jpg" },
    { name: "Adidas Duramo Kids",  brand: "ADIDAS", category: "SPORTS",  gender: "KIDS", price: 2999, mrp: 3999, sizes: ["1","2","3","4","5"],  stock: 45, isFeatured: false, isNew: true,  tags: ["kids","sports","school"],     images: "https://i.imgur.com/eBlfNkp.jpg" },
    { name: "Nike Court Vision",   brand: "NIKE", category: "BASKETBALL", gender: "MEN", price: 6999, mrp: 8499, sizes: ["7","8","9","10","11"], stock: 28, isFeatured: true, isNew: false, tags: ["basketball","court","classic"], images: "https://i.imgur.com/yVeIeDa.jpg" },
    { name: "Skechers Go Walk",    brand: "SKECHERS", category: "CASUALS", gender: "MEN", price: 3999, mrp: 5499, sizes: ["4","5","6","7","8"], stock: 38, isFeatured: false, isNew: true,  tags: ["walking","comfort","daily"],    images: "https://i.imgur.com/eMCCMiD.jpg" },
    { name: "Woodland Derby",      brand: "WOODLAND", category: "FORMALS", gender: "MEN", price: 6999, mrp: 8499, sizes: ["7","8","9","10","11"], stock: 18, isFeatured: false, isNew: false, tags: ["formal","leather","office"],      images: "https://i.imgur.com/7u7xkFM.jpg" },
    { name: "Puma Mirage Sport",   brand: "PUMA", category: "SNEAKERS", gender: "WOMEN", price: 8499, mrp: 10499, sizes: ["6","7","8","9","10","11"], stock: 22, isFeatured: true, isNew: true, tags: ["sport","lifestyle","runner"], images: "https://i.imgur.com/hOTXC8z.jpg" },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        description: `Premium ${p.name} — crafted for performance and style. ${p.tags.join(", ")}.`,
        sizes: Array.isArray(p.sizes) ? p.sizes.join(",") : p.sizes,
        tags: Array.isArray(p.tags) ? p.tags.join(",") : p.tags,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 200) + 10,
      },
    });
  }

  console.log("✅ Seed complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
