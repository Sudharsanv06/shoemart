const ApiError = require("../utils/ApiError");

module.exports = (req, res, next) => {
  if (req.user?.role !== "ADMIN") return next(new ApiError(403, "Admin access required"));
  next();
};
