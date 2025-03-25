const { PrismaClient } = require("@prisma/client");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const prisma = new PrismaClient();

exports.createBusiness = catchAsyncErrors(async (req, res, next) => {
  const { gstNumber, businessName, businessEmail } = req.body;

  if (!gstNumber || !businessEmail || !businessName) {
    return next(
      new ErrorHandler(
        "Please provide all required fields: GST Number, Business Name, Business Email, and Address.",
        400
      )
    );
  }

  const businessExists = await prisma.business.findFirst({
    where: {
      OR: [{ gstNumber }, { businessEmail }, { userId: req.id }],
    },
  });

  if (businessExists) {
    return next(
      new ErrorHandler(
        "A business with this GST Number or Email or User already exists. Please use different credentials.",
        409
      )
    );
  }

  const business = await prisma.business.create({
    data: {
      gstNumber,
      businessName,
      businessEmail,
      userId: req.id,
    },
  });

  res.status(201).json({
    success: true,
    message: "Business registered successfully!",
    business,
  });
});
