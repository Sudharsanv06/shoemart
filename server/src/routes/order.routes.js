const router = require("express").Router();
const auth   = require("../middlewares/auth");
const admin  = require("../middlewares/admin");
const c      = require("../controllers/order.controller");

router.use(auth);
router.post("/",              c.createOrder);
router.get("/",               c.getUserOrders);
router.get("/:id",            c.getOrder);
router.get("/admin/all",      admin, c.getAllOrders);
router.get("/admin/:id",      admin, c.getAdminOrder);
router.patch("/admin/:id",    admin, c.updateOrderStatus);

module.exports = router;
