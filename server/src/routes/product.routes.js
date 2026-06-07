const router = require("express").Router();
const auth   = require("../middlewares/auth");
const admin  = require("../middlewares/admin");
const upload = require("../middlewares/upload");
const c      = require("../controllers/product.controller");

router.get("/",           c.getProducts);
router.get("/featured",   c.getFeatured);
router.get("/new",        c.getNewArrivals);

// Search products (fixed for enum fields)
router.get("/search", async (req, res, next) => {
  try {
    const prisma      = require("../config/db");
    const ApiResponse = require("../utils/ApiResponse");
    const { q }       = req.query;

    if (!q || q.trim().length < 1) {
      return res.json(new ApiResponse(200, []));
    }

    const query = q.trim().toUpperCase();

    // Map common search terms to enum values
    const brandMap = {
      "NIKE": "NIKE", "ADIDAS": "ADIDAS", "PUMA": "PUMA",
      "REEBOK": "REEBOK", "SKECHERS": "SKECHERS",
      "WOODLAND": "WOODLAND", "OTHER": "OTHER",
    };

    const categoryMap = {
      "CASUAL": "CASUALS", "CASUALS": "CASUALS",
      "FORMAL": "FORMALS", "FORMALS": "FORMALS",
      "SPORT": "SPORTS", "SPORTS": "SPORTS",
      "RUNNING": "RUNNING", "SNEAKER": "SNEAKERS",
      "SNEAKERS": "SNEAKERS", "SANDAL": "SANDALS",
      "SANDALS": "SANDALS", "BOOTS": "BOOTS",
      "BOOT": "BOOTS", "FLATS": "FLATS",
      "HEELS": "HEELS", "SCHOOL": "SCHOOL",
      "BASKETBALL": "BASKETBALL", "FOOTBALL": "FOOTBALL",
      "TRAINING": "TRAINING", "DANCE": "DANCE",
    };

    const matchedBrand    = brandMap[query]    || null;
    const matchedCategory = categoryMap[query] || null;

    const orConditions = [
      { name: { contains: q.trim(), mode: "insensitive" } },
      { tags: { contains: q.trim(), mode: "insensitive" } },
    ];

    if (matchedBrand)    orConditions.push({ brand:    { equals: matchedBrand    } });
    if (matchedCategory) orConditions.push({ category: { equals: matchedCategory } });

    const products = await prisma.product.findMany({
      where:   { OR: orConditions },
      take:    6,
      select:  {
        id:       true,
        name:     true,
        brand:    true,
        price:    true,
        mrp:      true,
        images:   true,
        category: true,
        gender:   true,
        rating:   true,
      },
      orderBy: { rating: "desc" },
    });

    res.json(new ApiResponse(200, products));
  } catch (e) { next(e); }
});

router.get("/:id",        c.getProduct);
router.post("/",          auth, admin, upload.array("images", 5), c.createProduct);
router.patch("/:id",      auth, admin, upload.array("images", 5), c.updateProduct);
router.delete("/:id",     auth, admin, c.deleteProduct);

module.exports = router;