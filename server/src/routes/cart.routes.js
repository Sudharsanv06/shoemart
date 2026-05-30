const router = require("express").Router();
const auth   = require("../middlewares/auth");
const c      = require("../controllers/cart.controller");

router.use(auth);
router.get("/",            c.getCart);
router.post("/",           c.addToCart);
router.patch("/:id",       c.updateCart);
router.delete("/clear",    c.clearCart);
router.delete("/:id",      c.removeFromCart);

module.exports = router;
