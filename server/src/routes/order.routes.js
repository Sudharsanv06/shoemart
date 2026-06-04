const router  = require("express").Router();
const auth    = require("../middlewares/auth");
const admin   = require("../middlewares/admin");
const c       = require("../controllers/order.controller");

router.post("/",           auth,        c.createOrder);
router.get("/",            auth,        c.getUserOrders);
router.get("/admin/all",   auth, admin, c.getAllOrders);
router.patch("/admin/:id", auth, admin, c.updateOrderStatus);
router.get("/:id/invoice", auth,        c.downloadInvoice);
router.get("/:id",         auth,        c.getOrder);

module.exports = router;
