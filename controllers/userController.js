const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { generateTokens } = require("../utils/generateToken");
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require("../utils/cookieOptions");

const prisma = new PrismaClient();

exports.signUp = catchAsyncErrors(async (req, res, next) => {
  const { fullName, email, mobile, password } = req.body;

  if (!fullName || !email || !password || !mobile) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { mobile }] },
  });

  if (existingUser) {
    return next(
      new ErrorHandler(
        "An account with this email or mobile number already exists. Please log in.",
        409
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      mobile,
      password: hashedPassword,
    },
  });

  const { accessToken, refreshToken } = generateTokens(user.id);

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  res.status(201).json({
    success: true,
    message: "Registration successful! Welcome aboard.",
  });
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Both email and password are required.", 400));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return next(
      new ErrorHandler("Incorrect email or password. Please try again.", 401)
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(
      new ErrorHandler("Incorrect email or password. Please try again.", 401)
    );
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  res
    .status(200)
    .json({ success: true, message: "Login successful! Welcome back." });
});

exports.refreshToken = catchAsyncErrors(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new ErrorHandler("Session expired. Please log in again.", 401));
  }
  const { id } = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return next(new ErrorHandler("User not found. Please log in again.", 404));
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    user.id
  );

  res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  res.status(200).json({
    success: true,
    accessToken,
    message: "Session refreshed successfully.",
  });
});

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.id },
    select: {
      fullName: true,
      email: true,
      addresses: true,
      business: true,
      business: {
        select: {
          gstNumber: true,
          businessName: true,
          businessEmail: true,
          address: true,
        },
      },
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found. Please log in.", 404));
  }

  res.status(200).json({ success: true, user });
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const { fullName, mobile, addresses } = req.body;

  const user = await prisma.user.update({
    where: { id: req.id },
    data: {
      fullName,
      mobile,
    },
  });

  if (!user) {
    return next(
      new ErrorHandler("User not found. Unable to update profile.", 404)
    );
  }

  res
    .status(200)
    .json({ success: true, message: "Profile updated successfully.", user });
});

exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      mobile: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  if (!users.length) {
    return next(new ErrorHandler("No users found in the system.", 404));
  }

  res.status(200).json({ success: true, users });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return next(new ErrorHandler("User not found. Unable to delete.", 404));
  }

  await prisma.user.delete({ where: { id } });

  res
    .status(200)
    .json({ success: true, message: "User deleted successfully." });
});

exports.logOut = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res
    .status(200)
    .json({ success: true, message: "Logged out successfully. See you soon!" });
});
