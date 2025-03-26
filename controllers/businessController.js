const { PrismaClient } = require("@prisma/client");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { businessSchema } = require("../schema/businessSchema");
const prisma = new PrismaClient();

exports.createBusiness = catchAsyncErrors(async (req, res, next) => {
  const validationResult = businessSchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(
      new ErrorHandler(validationResult.error.errors[0].message, 400)
    );
  }

  const { gstNumber, businessName, businessEmail } = validationResult.data;

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
