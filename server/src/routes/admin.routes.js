const express = require("express");
const router = express.Router();

const prisma = require("../config/db");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const ApiResponse = require("../utils/ApiResponse");

router.use(auth, admin);

// =========================
// USERS
// =========================

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// PUT /api/admin/users/:id/role
router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({
        message: "Role must be USER or ADMIN",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        message: "Cannot delete your own account",
      });
    }

    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =========================
// DASHBOARD STATS
// =========================

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueData] =
      await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count({
          where: {
            paymentStatus: "PAID",
          },
        }),
        prisma.order.aggregate({
          where: {
            paymentStatus: "PAID",
          },
          _sum: {
            total: true,
          },
        }),
      ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueData._sum.total || 0,
      recentOrders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// =========================
// ANALYTICS
// =========================

// GET /api/admin/analytics
router.get("/analytics", async (req, res, next) => {
  try {
    const days = parseInt(req.query.days || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        paymentStatus: "PAID",
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

// =========================
// LOW STOCK
// =========================

// GET /api/admin/low-stock
router.get("/low-stock", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: {
          lte: 10,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
      },
      orderBy: {
        stock: "asc",
      },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

// =========================
// COUPONS
// =========================

// GET /api/admin/coupons
router.get("/coupons", async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(new ApiResponse(200, coupons));
  } catch (e) {
    next(e);
  }
});

// POST /api/admin/coupons
router.post("/coupons", async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrder,
      maxUses,
      expiresAt,
    } = req.body;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        discountType: discountType || "PERCENTAGE",
        discountValue: parseFloat(discountValue),
        minOrder: parseFloat(minOrder) || 0,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, coupon, "Coupon created"));
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/coupons/:id
router.patch("/coupons/:id", async (req, res, next) => {
  try {
    const coupon = await prisma.coupon.update({
      where: {
        id: req.params.id,
      },
      data: {
        isActive: req.body.isActive,
      },
    });

    res.json(
      new ApiResponse(200, coupon, "Coupon updated")
    );
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/coupons/:id
router.delete("/coupons/:id", async (req, res, next) => {
  try {
    await prisma.coupon.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json(
      new ApiResponse(200, null, "Coupon deleted")
    );
  } catch (e) {
    next(e);
  }
});

module.exports = router;