const prisma = require("../config/db");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
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
      discount = 0,
      couponCode = null,
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

    const subtotal = cartItems.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0
    );

    const deliveryCharge = subtotal >= 999 ? 0 : 99;

    const total = Math.max(
      subtotal + deliveryCharge - Number(discount || 0),
      0
    );

    // Increase coupon usage count if coupon was applied
    if (couponCode) {
      await prisma.coupon.updateMany({
        where: {
          code: couponCode,
          isActive: true,
        },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        addressId: resolvedAddressId,
        discount: Number(discount || 0),
        couponCode,
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

    // Log initial status
    await prisma.orderStatusLog.create({
      data: {
        orderId: order.id,
        status: "CONFIRMED",
        message: "Order placed and confirmed successfully",
      },
    });

    // Clear cart after order
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

    // Send order confirmation email (non-blocking)
    try {
      const fullOrder = await prisma.order.findUnique({
        where: { id: order.id },
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
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { product: true } },
        address: true,
        statusLogs: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!order) throw new ApiError(404, "Order not found");
    if (order.userId !== req.user.id && req.user.role !== "ADMIN")
      throw new ApiError(403, "Not authorized");

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
        statusLogs: { orderBy: { createdAt: "asc" } },
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

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    // Log the status change
    const statusMessages = {
      PENDING: "Order is pending confirmation",
      CONFIRMED: "Order confirmed and being prepared",
      PROCESSING: "Order is being packed and processed",
      SHIPPED: "Order has been shipped and is on the way",
      DELIVERED: "Order delivered successfully",
      CANCELLED: "Order has been cancelled",
      RETURNED: "Order return has been initiated",
    };

    await prisma.orderStatusLog.create({
      data: {
        orderId: order.id,
        status,
        message: statusMessages[status] || "Order status updated",
      },
    });

    // Send status update email
    try {
      const emailData = emailTemplates.orderStatusEmail(order.user, order);
      sendEmail({ to: order.user.email, ...emailData });
    } catch (emailErr) {
      console.error("Email failed:", emailErr.message);
    }

    res.json(new ApiResponse(200, order, "Status updated"));
  } catch (e) { next(e); }
};

const generateInvoice = require("../utils/generateInvoice");

exports.downloadInvoice = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { product: true } },
        address: true,
        user: true,
      },
    });

    if (!order)
      throw new ApiError(404, "Order not found");

    if (order.userId !== req.user.id && req.user.role !== "ADMIN")
      throw new ApiError(403, "Not authorized");

    const pdfBuffer = await generateInvoice(order, order.user);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="SHOEMART-Invoice-${order.orderNumber}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });
    res.end(pdfBuffer);
  } catch (e) {
    console.error("Invoice generation error:", e.message);
    next(e);
  }
};