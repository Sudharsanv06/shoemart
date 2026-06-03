require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Get first product
  const product = await prisma.product.findFirst();
  if (!product) {
    console.log("No products found");
    return;
  }
  console.log("Product:", product.name);
  console.log("Current rating:", product.rating);
  console.log("Current reviewCount:", product.reviewCount);

  // Get all reviews for this product
  const reviews = await prisma.review.findMany({
    where: { productId: product.id }
  });
  console.log("Actual reviews in DB:", reviews.length);

  if (reviews.length > 0) {
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    console.log("Calculated avg:", avg.toFixed(1));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
