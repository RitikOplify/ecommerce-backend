const { PrismaClient } = require("@prisma/client");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { createProductSchema } = require("../schema/productSchema");
const prisma = new PrismaClient();

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const validationResult = createProductSchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(
      new ErrorHandler(validationResult.error.errors[0].message, 400)
    );
  }

  const {
    name,
    price,
    about,
    details,
    warranty,
    subCategoryLevel2Id,
    keyFeatures,
    specifications,
  } = validationResult.data;

  const subCategoryLevel2Exists = await prisma.subCategoryLevel2.findUnique({
    where: { id: subCategoryLevel2Id },
  });
  if (!subCategoryLevel2Exists) {
    return next(new ErrorHandler("Sub Category Level 2 not found.", 404));
  }

  const product = await prisma.product.create({
    data: {
      name,
      price,
      about,
      details,
      warranty,
      subCategoryLevel2Id,
    },
  });

  if (keyFeatures && keyFeatures.length > 0) {
    await prisma.keyFeature.createMany({
      data: keyFeatures.map((feature) => ({
        productId: product.id,
        feature,
      })),
    });
  }

  if (specifications && specifications.length > 0) {
    await prisma.specification.createMany({
      data: specifications.map(({ key, value }) => ({
        productId: product.id,
        key,
        value,
      })),
    });
  }

  const productWithDetails = await prisma.product.findUnique({
    where: { id: product.id },
    include: {
      keyFeatures: true,
      specifications: true,
    },
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully!",
    product: productWithDetails,
  });
});
