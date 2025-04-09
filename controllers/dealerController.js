const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { generateTokens } = require("../utils/generateToken");
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require("../utils/cookieOptions");
const {
  createDealerSchema,
  loginSchema,
} = require("../schema/adminValidation");
const prisma = new PrismaClient();

exports.createDealer = catchAsyncErrors(async (req, res, next) => {
  const { name, gstNo, state, city, pincode, companyId, email, password } =
    req.body;

  const parsed = createDealerSchema.safeParse({
    name,
    gstNo,
    state,
    city,
    pincode,
    companyId,
    password,
    email,
  });
  if (!parsed.success) {
    return next(new ErrorHandler(parsed.error.errors[0].message, 400));
  }

  const existingDealer = await prisma.dealer.findUnique({
    where: { email },
  });
  if (existingDealer) {
    return next(
      new ErrorHandler("dealer with this gst no. already exists", 400)
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const dealer = await prisma.dealer.create({
    data: {
      email,
      name,
      gstNo,
      state,
      city,
      pincode,
      companyId,
      password: hashedPassword,
    },
  });

  res
    .status(201)
    .json({
      message: "Thank You For Registration w'll get back to you soon",
      dealer,
    });
});

exports.dealerLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return next(new ErrorHandler(parsed.error.errors[0].message, 400));
  }
  const dealer = await prisma.dealer.findUnique({
    where: { email },
  });

  if (!dealer) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }

  if (dealer.status !== "ACTIVE") {
    return next(new ErrorHandler("Your account is not approved yet", 401));
  }
  const isMatch = await bcrypt.compare(password, dealer.password);
  if (!isMatch) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }

  const { accessToken, refreshToken } = generateTokens(dealer.id, "Dealer");

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
  res
    .status(200)
    .json({ success: true, message: "Login successful! Welcome back." });
});
