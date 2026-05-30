const router = require("express").Router();
const auth   = require("../middlewares/auth");
const c      = require("../controllers/wishlist.controller");

router.use(auth);
router.get("/",              c.getWishlist);
router.post("/",             c.addToWishlist);
router.delete("/:productId", c.removeFromWishlist);

module.exports = router;
