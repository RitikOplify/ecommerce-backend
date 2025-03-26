const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { generateTokens } = require("../utils/generateToken");
const { signUpSchema, loginSchema } = require("../schema/userSchema");

const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require("../utils/cookieOptions");

const prisma = new PrismaClient();

exports.adminSignUp = catchAsyncErrors(async (req, res, next) => {
  const validationResult = signUpSchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(
      new ErrorHandler(validationResult.error.errors[0].message, 400)
    );
  }

  const { fullName, email, mobile, password } = validationResult.data;

  const existingAdmin = await prisma.admin.findFirst({
    where: { OR: [{ email }, { mobile }] },
  });

  if (existingAdmin) {
    return next(
      new ErrorHandler(
        "An account with this email or mobile number already exists. Please log in.",
        409
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      fullName,
      email,
      mobile,
      password: hashedPassword,
    },
  });

  const { accessToken, refreshToken } = generateTokens(admin.id, true);

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  res.status(201).json({
    success: true,
    message: "Registration successful! Welcome aboard.",
  });
});

exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(
      new ErrorHandler(validationResult.error.errors[0].message, 400)
    );
  }

  const { email, password } = validationResult.data;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return next(
      new ErrorHandler("Incorrect email or password. Please try again.", 401)
    );
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return next(
      new ErrorHandler("Incorrect email or password. Please try again.", 401)
    );
  }

  const { accessToken, refreshToken } = generateTokens(admin.id, true);

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
  const admin = await prisma.admin.findUnique({ where: { id } });

  if (!admin) {
    return next(new ErrorHandler("User not found. Please log in again.", 404));
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    admin.id,
    true
  );

  res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  res.status(200).json({
    success: true,
    accessToken,
    message: "Session refreshed successfully.",
  });
});

exports.logOut = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res
    .status(200)
    .json({ success: true, message: "Logged out successfully. See you soon!" });
});
