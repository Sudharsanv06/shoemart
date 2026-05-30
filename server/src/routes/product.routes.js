const router = require("express").Router();
const auth   = require("../middlewares/auth");
const admin  = require("../middlewares/admin");
const upload = require("../middlewares/upload");
const c      = require("../controllers/product.controller");

router.get("/",           c.getProducts);
router.get("/featured",   c.getFeatured);
router.get("/new",        c.getNewArrivals);
router.get("/:id",        c.getProduct);
router.post("/",          auth, admin, upload.array("images", 5), c.createProduct);
router.patch("/:id",      auth, admin, upload.array("images", 5), c.updateProduct);
router.delete("/:id",     auth, admin, c.deleteProduct);

module.exports = router;
