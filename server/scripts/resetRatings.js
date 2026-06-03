require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Delete all existing reviews first
  await prisma.review.deleteMany({});
  console.log("✅ All reviews cleared");

  // Reset all product ratings and review counts to 0
  await prisma.product.updateMany({
    data: {
      rating:      0,
      reviewCount: 0,
    }
  });
  console.log("✅ All product ratings reset to 0");
  console.log("✅ Now when users add reviews the calculation will be accurate");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
