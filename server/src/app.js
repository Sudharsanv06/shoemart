const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// COUPON VALIDATION
// =========================

app.post(
  "/api/coupons/validate",
  require("./middlewares/auth"),
  async (req, res) => {
    try {
      const prisma = require("./config/db");

      const { code, orderTotal } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Code required",
        });
      }

      const coupon = await prisma.coupon.findUnique({
        where: {
          code: code.toUpperCase().trim(),
        },
      });

      if (!coupon || !coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired coupon",
        });
      }

      if (
        coupon.expiresAt &&
        new Date() > new Date(coupon.expiresAt)
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon has expired",
        });
      }

      if (
        coupon.maxUses &&
        coupon.usedCount >= coupon.maxUses
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit reached",
        });
      }

      if (orderTotal < coupon.minOrder) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount is ₹${coupon.minOrder}`,
        });
      }

      const discount =
        coupon.discountType === "PERCENTAGE"
          ? Math.min(
              Math.round(
                (orderTotal * coupon.discountValue) / 100
              ),
              orderTotal
            )
          : Math.min(
              coupon.discountValue,
              orderTotal
            );

      return res.json({
        success: true,
        data: {
          coupon,
          discount,
          finalTotal: orderTotal - discount,
        },
      });
    } catch (e) {
      console.error(e);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// =========================
// ROUTES
// =========================

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/wishlist", require("./routes/wishlist.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/reviews", require("./routes/review.routes"));

// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (_, res) =>
  res.json({ status: "ok" })
);

// =========================
// ERROR HANDLER
// =========================

app.use(require("./middlewares/error.middleware"));
app.use("/api/chat", require("./routes/chat.routes"));
module.exports = app;