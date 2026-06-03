const router = require("express").Router();
const auth   = require("../middlewares/auth");
const admin  = require("../middlewares/admin");
const c      = require("../controllers/review.controller");

router.get("/:productId",        c.getProductReviews);
router.post("/:productId",       auth, c.addReview);
router.delete("/:id",            auth, c.deleteReview);
router.get("/admin/all",         auth, admin, c.getAllReviews);

module.exports = router;
