const prisma      = require("../config/db");
const ApiResponse = require("../utils/ApiResponse");
const ApiError    = require("../utils/ApiError");

const getCartWithProducts = (userId) =>
  prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { id: "asc" },
  });

exports.getCart = async (req, res, next) => {
  try {
    const items = await getCartWithProducts(req.user.id);
    res.json(new ApiResponse(200, items));
  } catch (e) { next(e); }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    if (!productId || !size) throw new ApiError(400, "productId and size required");

    await prisma.cartItem.upsert({
      where: { userId_productId_size: { userId: req.user.id, productId, size } },
      update: { quantity: { increment: quantity } },
      create: { userId: req.user.id, productId, size, quantity },
    });
    const items = await getCartWithProducts(req.user.id);
    res.json(new ApiResponse(200, items, "Added to cart"));
  } catch (e) { next(e); }
};

exports.updateCart = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      await prisma.cartItem.delete({ where: { id: req.params.id } });
    } else {
      await prisma.cartItem.update({ where: { id: req.params.id }, data: { quantity } });
    }
    const items = await getCartWithProducts(req.user.id);
    res.json(new ApiResponse(200, items));
  } catch (e) { next(e); }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.id } });
    const items = await getCartWithProducts(req.user.id);
    res.json(new ApiResponse(200, items, "Removed from cart"));
  } catch (e) { next(e); }
};

exports.clearCart = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json(new ApiResponse(200, [], "Cart cleared"));
  } catch (e) { next(e); }
};
