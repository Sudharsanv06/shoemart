const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const auth  = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.use(auth, admin);

// GET /api/admin/users — all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.user.count(),
    ]);
    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/users/:id/role — update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Role must be USER or ADMIN' });
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueData] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count({ where: { paymentStatus: 'PAID' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
