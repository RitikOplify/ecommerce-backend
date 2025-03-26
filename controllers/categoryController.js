const { PrismaClient } = require("@prisma/client");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const {
  mainCategorySchema,
  subCategorySchema,
  subCategoryLevel2Schema,
} = require("../schema/categorySchema");

const prisma = new PrismaClient();

exports.createMainCategory = catchAsyncErrors(async (req, res, next) => {
  const validationResult = mainCategorySchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(
      new ErrorHandler(validationResult.error.errors[0].message, 400)
    );
  }

  const { name } = validationResult.data;

  const categoryExists = await prisma.mainCategory.findUnique({
    where: { name },
  });
  if (categoryExists) {
    return next(
      new ErrorHandler("Category with this name already exists.", 409)
    );
  }

  const category = await prisma.mainCategory.create({ data: { name } });

  res.status(201).json({
    success: true,
    message: "Main Category created successfully!",
    category,
  });
});

exports.createSubCategory = catchAsyncErrors(async (req, res, next) => {
  const validationResult = subCategorySchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(
      new ErrorHandler(validationResult.error.errors[0].message, 400)
    );
  }

  const { name, mainCategoryId } = validationResult.data;

  const categoryExists = await prisma.mainCategory.findUnique({
    where: { id: mainCategoryId },
  });
  if (!categoryExists) {
    return next(new ErrorHandler("Main Category not found.", 404));
  }

  const subCategory = await prisma.subCategory.create({
    data: { name, mainCategoryId },
  });

  res.status(201).json({
    success: true,
    message: "Sub Category created successfully!",
    subCategory,
  });
});

exports.createSubCategoryLevel2 = catchAsyncErrors(async (req, res, next) => {
  const validationResult = subCategoryLevel2Schema.safeParse(req.body);
  if (!validationResult.success) {
    return next(
      new ErrorHandler(validationResult.error.errors[0].message, 400)
    );
  }

  const { name, subCategoryId } = validationResult.data;

  const subCategoryExists = await prisma.subCategory.findUnique({
    where: { id: subCategoryId },
  });
  if (!subCategoryExists) {
    return next(new ErrorHandler("Sub Category not found.", 404));
  }

  const subCategoryLevel2 = await prisma.subCategoryLevel2.create({
    data: { name, subCategoryId },
  });

  res.status(201).json({
    success: true,
    message: "Sub Category Level 2 created successfully!",
    subCategoryLevel2,
  });
});
