const prisma      = require("../config/db");
const ApiError    = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const toArr = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "string") return parsed.split(",").map((s) => s.trim()).filter(Boolean);
    } catch {
      return String(val).split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return String(val).split(",").map((s) => s.trim()).filter(Boolean);
};

const fromArr = (val) => {
  if (!val) return "";
  if (Array.isArray(val)) return val.join(",");
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.join(",");
      if (typeof parsed === "string") return parsed;
    } catch {
      return val;
    }
  }
  return val;
};

const parseProduct = (p) => {
  if (!p) return p;
  return {
    ...p,
    sizes: toArr(p.sizes),
    images: toArr(p.images),
    tags: toArr(p.tags),
  };
};

const normalizeEnum = (val) => {
  if (!val) return val;
  const map = {
    CASUAL: "CASUALS",
    FORMAL: "FORMALS",
    SPORT: "SPORTS",
    SNEAKER: "SNEAKERS",
    SANDAL: "SANDALS",
    BOOT: "BOOTS",
    FLAT: "FLATS",
    HEEL: "HEELS",
    MEN: "MEN",
    WOMEN: "WOMEN",
    KIDS: "KIDS",
    UNISEX: "UNISEX",
    CASUALS: "CASUALS",
    FORMALS: "FORMALS",
    SPORTS: "SPORTS",
    RUNNING: "RUNNING",
    SNEAKERS: "SNEAKERS",
    SANDALS: "SANDALS",
    BOOTS: "BOOTS",
    FLATS: "FLATS",
    HEELS: "HEELS",
    SCHOOL: "SCHOOL",
    DANCE: "DANCE",
    BASKETBALL: "BASKETBALL",
    FOOTBALL: "FOOTBALL",
    TRAINING: "TRAINING",
  };

  return map[String(val).toUpperCase()] || String(val).toUpperCase();
};

exports.getProducts = async (req, res, next) => {
  try {
    const {
      brand,
      category,
      gender,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const where = {};

    if (brand) where.brand = brand.toUpperCase();
    if (category) {
      const categoryValue = normalizeEnum(category);
      if (["MEN", "WOMEN", "KIDS", "UNISEX"].includes(categoryValue)) {
        where.gender = categoryValue;
      } else {
        where.category = categoryValue;
      }
    }
    if (gender) {
      const g = gender.toUpperCase();
      where.OR = [
        { gender: g },
        { gender: "UNISEX" },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
        ? { price: "desc" }
        : sort === "rating"
        ? { rating: "desc" }
        : sort === "newest"
        ? { createdAt: "desc" }
        : { createdAt: "desc" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: parseInt(limit) }),
      prisma.product.count({ where }),
    ]);

    res.json(
      new ApiResponse(200, {
        products: products.map(parseProduct),
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      })
    );
  } catch (e) {
    next(e);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) throw new ApiError(404, "Product not found");
    res.json(new ApiResponse(200, parseProduct(product)));
  } catch (e) { next(e); }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({ where: { isFeatured: true }, take: 8 });
    res.json(new ApiResponse(200, products.map(parseProduct)));
  } catch (e) { next(e); }
};

exports.getNewArrivals = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { isNew: true }, orderBy: { createdAt: "desc" }, take: 8
    });
    res.json(new ApiResponse(200, products.map(parseProduct)));
  } catch (e) { next(e); }
};

// ADMIN
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, mrp, brand, category, gender, sizes, stock, isFeatured, isNew, tags } = req.body;
    const images = req.files?.map(f => f.path) || req.body.images || [];
    const product = await prisma.product.create({
      data: { name, description, price: +price, mrp: +mrp, brand: brand.toUpperCase(), category: normalizeEnum(category), gender: normalizeEnum(gender),
              sizes: fromArr(sizes),
              stock: +stock, isFeatured: isFeatured === "true",
              isNew: isNew === "true",
              tags: fromArr(tags),
              images: fromArr(images) || (Array.isArray(images) ? images.join(",") : images) },
    });
    res.status(201).json(new ApiResponse(201, parseProduct(product), "Product created"));
  } catch (e) { next(e); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Product not found");

    const {
      name,
      description,
      price,
      mrp,
      brand,
      category,
      gender,
      sizes,
      tags,
      stock,
      isFeatured,
      isNew,
      existingImages,
    } = req.body;

    let finalImages = [];

    if (existingImages) {
      try {
        const parsed = typeof existingImages === "string" ? JSON.parse(existingImages) : existingImages;
        if (Array.isArray(parsed)) finalImages = [...parsed];
        else if (typeof parsed === "string") finalImages = parsed.split(",").map((s) => s.trim()).filter(Boolean);
      } catch {
        finalImages = existingImages.toString().split(",").map((s) => s.trim()).filter(Boolean);
      }
    } else {
      finalImages = toArr(existing.images);
    }

    if (req.files && req.files.length > 0) {
      const newUrls = req.files.map((f) => f.path || f.secure_url || f.url).filter(Boolean);
      finalImages = [...finalImages, ...newUrls];
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (mrp !== undefined) updateData.mrp = parseFloat(mrp);
    if (brand !== undefined) updateData.brand = brand.toUpperCase();
    if (category !== undefined) updateData.category = normalizeEnum(category);
    if (gender !== undefined) updateData.gender = normalizeEnum(gender);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (sizes !== undefined) updateData.sizes = fromArr(sizes);
    if (tags !== undefined) updateData.tags = fromArr(tags);
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === true || isFeatured === "true";
    if (isNew !== undefined) updateData.isNew = isNew === true || isNew === "true";
    if (finalImages.length > 0) updateData.images = fromArr(finalImages);

    const updated = await prisma.product.update({ where: { id }, data: updateData });

    res.json(new ApiResponse(200, parseProduct(updated), "Product updated successfully"));
  } catch (e) {
    next(e);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Product not found");

    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.wishlistItem.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });

    await prisma.product.delete({ where: { id } });

    res.json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (e) {
    next(e);
  }
};
