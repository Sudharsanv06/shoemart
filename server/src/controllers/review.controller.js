const prisma = require("../config/db");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Shared helper — always recalculates from scratch
const recalculateProductRating = async (productId) => {
  const all = await prisma.review.findMany({ where: { productId } });
  const avg = all.length > 0
    ? all.reduce((sum, r) => sum + r.rating, 0) / all.length
    : 0;
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating:      parseFloat(avg.toFixed(1)),
      reviewCount: all.length,
    },
  });
  return { avg: parseFloat(avg.toFixed(1)), count: all.length };
};

// Get all reviews for a product
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where:   { productId: req.params.productId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });

    const avg = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json(new ApiResponse(200, {
      reviews,
      avgRating:    parseFloat(avg.toFixed(1)),
      totalReviews: reviews.length,
    }));
  } catch (e) { next(e); }
};

// Add a review
exports.addReview = async (req, res, next) => {
  try {
    const { rating, title, body } = req.body;
    const { productId } = req.params;

    if (!rating || !title || !body)
      throw new ApiError(400, "Rating, title and review are required");
    if (rating < 1 || rating > 5)
      throw new ApiError(400, "Rating must be between 1 and 5");

    // Upsert — one review per user per product
    await prisma.review.upsert({
      where:  { userId_productId: { userId: req.user.id, productId } },
      update: { rating: parseInt(rating), title, body },
      create: { rating: parseInt(rating), title, body, userId: req.user.id, productId },
    });

    // ALWAYS recalculate from ALL reviews for this product
    await recalculateProductRating(productId);

    // Return fresh review with user
    const review = await prisma.review.findUnique({
      where:   { userId_productId: { userId: req.user.id, productId } },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    res.status(201).json(new ApiResponse(201, review, "Review submitted"));
  } catch (e) { next(e); }
};

// Delete review (admin or own)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) throw new ApiError(404, "Review not found");

    if (review.userId !== req.user.id && req.user.role !== "ADMIN")
      throw new ApiError(403, "Not authorized");

    const { productId } = review;
    await prisma.review.delete({ where: { id: req.params.id } });

    // Recalculate after delete
    await recalculateProductRating(productId);

    res.json(new ApiResponse(200, null, "Review deleted"));
  } catch (e) { next(e); }
};

// Admin — get all reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user:    { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, brand: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(new ApiResponse(200, reviews));
  } catch (e) { next(e); }
};
