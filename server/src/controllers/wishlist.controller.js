const prisma      = require("../config/db");
const ApiResponse = require("../utils/ApiResponse");

const getWishlist = (userId) =>
  prisma.wishlistItem.findMany({ where: { userId }, include: { product: true } });

exports.getWishlist    = async (req, res, next) => {
  try { res.json(new ApiResponse(200, await getWishlist(req.user.id))); } catch (e) { next(e); }
};

exports.addToWishlist  = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await prisma.wishlistItem.upsert({
      where:  { userId_productId: { userId: req.user.id, productId } },
      update: {},
      create: { userId: req.user.id, productId },
    });
    res.json(new ApiResponse(200, await getWishlist(req.user.id), "Added to wishlist"));
  } catch (e) { next(e); }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    await prisma.wishlistItem.deleteMany({ where: { userId: req.user.id, productId: req.params.productId } });
    res.json(new ApiResponse(200, await getWishlist(req.user.id), "Removed from wishlist"));
  } catch (e) { next(e); }
};
