const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const prisma = require("../config/db");
const ApiError    = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw new ApiError(400, "All fields required");

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new ApiError(409, "Email already registered");

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hash },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });
    const token = signToken(user.id);
    res.status(201).json(new ApiResponse(201, { user, token }, "Account created"));
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new ApiError(401, "Invalid credentials");

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
    const token    = signToken(user.id);
    res.json(new ApiResponse(200, { user: safeUser, token }, "Login successful"));
  } catch (e) { next(e); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        addresses: {
          orderBy: [{ isDefault: "desc" }],
          select: {
            id: true,
            label: true,
            fullName: true,
            phone: true,
            line1: true,
            line2: true,
            city: true,
            state: true,
            pincode: true,
            isDefault: true,
          },
        },
      },
    });
    res.json(new ApiResponse(200, user));
  } catch (e) { next(e); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, oldPassword, newPassword } = req.body;

    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!currentUser) throw new ApiError(404, "User not found");

    const updateData = {};
    if (name !== undefined && String(name).trim()) updateData.name = String(name).trim();
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    if (req.file) {
      updateData.avatar = req.file.path || req.file.secure_url;
    }

    if (newPassword !== undefined) {
      if (!oldPassword) throw new ApiError(400, "Current password is required");
      const valid = await bcrypt.compare(oldPassword, currentUser.password);
      if (!valid) throw new ApiError(401, "Current password is incorrect");
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, createdAt: true },
    });

    res.json(new ApiResponse(200, user, "Profile updated successfully"));
  } catch (e) { next(e); }
};
