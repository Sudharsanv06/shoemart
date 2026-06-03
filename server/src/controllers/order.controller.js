const prisma      = require("../config/db");
const ApiResponse = require("../utils/ApiResponse");
const ApiError    = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");
const emailTemplates = require("../utils/emailTemplates");



const toArr = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val).split(",").map((s) => s.trim()).filter(Boolean);
};

const parseProduct = (p) => (p ? { ...p, sizes: toArr(p.sizes), images: toArr(p.images), tags: toArr(p.tags) } : p);

exports.createOrder = async (req, res, next) => {
  try {
    const {
      addressId,
      address,
      paymentMethod = "RAZORPAY",
      razorpayOrderId,
      razorpayPaymentId,
    } = req.body;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id }, include: { product: true }
    });
    if (!cartItems.length) throw new ApiError(400, "Cart is empty");

    let resolvedAddressId = addressId || null;
    if (!resolvedAddressId && address) {
      const createdAddress = await prisma.address.create({
        data: {
          userId: req.user.id,
          label: address.label || "Home",
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1 || address.street || "",
          line2: address.line2 || "",
          city: address.city,
          state: address.state,
          pincode: address.pincode || address.zipCode || "",
          isDefault: Boolean(address.isDefault),
        },
      });
      resolvedAddressId = createdAddress.id;
    }

    if (!resolvedAddressId) throw new ApiError(400, "Address is required");

    const subtotal      = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const deliveryCharge = subtotal >= 999 ? 0 : 99;
    const total          = subtotal + deliveryCharge;

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        addressId: resolvedAddressId,
        // Store razorpay IDs in stripePaymentId field temporarily (it exists in DB already)
        stripePaymentId: req.body.razorpayPaymentId || req.body.razorpayOrderId || null,
        paymentMethod: "RAZORPAY",
        subtotal, deliveryCharge, total,
        paymentStatus: "PAID",
        status: "CONFIRMED",
        items: {
          create: cartItems.map(i => ({
            productId: i.productId, quantity: i.quantity,
            size: i.size, price: i.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } }, address: true },
    });

    // Clear cart after order
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

    // Send order confirmation email (non-blocking)
    try {
      const fullOrder = await prisma.order.findUnique({
        where:   { id: order.id },
        include: { items: { include: { product: true } }, address: true },
      });
      const emailData = emailTemplates.orderConfirmationEmail(req.user, fullOrder);
      sendEmail({ to: req.user.email, ...emailData });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
      // Order already created — just log, don't fail
    }

    const mapped = { ...order, razorpayPaymentId: order.stripePaymentId };
    res.status(201).json(new ApiResponse(201, mapped, "Order placed"));
  } catch (e) { next(e); }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } }, address: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(new ApiResponse(200, orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: parseProduct(item.product),
      })),
    }))));
  } catch (e) { next(e); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: { include: { product: true } }, address: true },
    });
    if (!order) throw new ApiError(404, "Order not found");
    res.json(new ApiResponse(200, {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: parseProduct(item.product),
      })),
    }));
  } catch (e) { next(e); }
};

// Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status: String(status).toUpperCase() } : {};
    const orders = await prisma.order.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } },
                 items: { include: { product: true } }, address: true },
      orderBy: { createdAt: "desc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });
    const total = await prisma.order.count({ where });
    res.json(new ApiResponse(200, {
      orders: orders.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          product: parseProduct(item.product),
        })),
      })),
      total,
    }));
  } catch (e) { next(e); }
};

exports.getAdminOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        address: true,
        items: { include: { product: true } },
      },
    });

    if (!order) throw new ApiError(404, "Order not found");

    res.json(new ApiResponse(200, {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: parseProduct(item.product),
      })),
    }));
  } catch (e) { next(e); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });

    // Send status update email
    try {
      const fullOrder = await prisma.order.findUnique({
        where:   { id: req.params.id },
        include: {
          items:   { include: { product: true } },
          user:    true,
        },
      });
      const emailData = emailTemplates.orderStatusEmail(fullOrder.user, fullOrder);
      sendEmail({ to: fullOrder.user.email, ...emailData });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    res.json(new ApiResponse(200, order, "Status updated"));
  } catch (e) { next(e); }
};
