require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt           = require("bcryptjs");

// Use direct URL for seeding to avoid pooler issues
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL },
  },
});

async function main() {
  console.log("Creating users...");

  const adminHash = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where:  { email: "admin@shoemart.com" },
    update: {},
    create: {
      name:     "Admin",
      email:    "admin@shoemart.com",
      password: adminHash,
      role:     "ADMIN",
    },
  });
  console.log("✅ Admin created");

  const userHash = await bcrypt.hash("User@123", 10);
  await prisma.user.upsert({
    where:  { email: "user@shoemart.com" },
    update: {},
    create: {
      name:     "Test User",
      email:    "user@shoemart.com",
      password: userHash,
      role:     "USER",
    },
  });
  console.log("✅ Test user created");
  console.log("✅ Done! Login with admin@shoemart.com / Admin@123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());