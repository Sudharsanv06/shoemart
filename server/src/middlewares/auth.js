const jwt    = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const prisma   = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new ApiError(401, "Not authenticated");
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user   = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new ApiError(401, "User not found");
    req.user = user;
    next();
  } catch (e) { next(new ApiError(401, "Invalid token")); }
};
