const { PrismaClient } = require("@prisma/client");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { addressSchema } = require("../schema/addressSchema");
const prisma = new PrismaClient();

exports.createAddress = catchAsyncErrors(async (req, res, next) => {
  const validationResult = addressSchema.safeParse(req.body);
  if (!validationResult.success) {
    return next(
      new ErrorHandler(validationResult.error.errors[0].message, 400)
    );
  }

  const {
    name,
    email,
    phone,
    alternatePhone,
    flatNo,
    area,
    landmark,
    pincode,
    city,
    state,
    country,
    addressType,
  } = validationResult.data;

  if (!["business", "delivery"].includes(addressType)) {
    return next(
      new ErrorHandler(
        "Invalid address type. Must be 'business' or 'delivery'.",
        400
      )
    );
  }

  const address = await prisma.address.create({
    data: {
      name,
      email,
      phone,
      alternatePhone,
      flatNo,
      area,
      landmark,
      pincode,
      city,
      state,
      country,
      addressType,
      userId: req.id,
    },
  });

  if (addressType === "business") {
    const business = await prisma.business.update({
      where: { userId: req.id },
      data: { addressId: address.id },
    });

    return res.status(201).json({
      success: true,
      message: "Business address added successfully!",
      address,
      business,
    });
  } else {
    await prisma.user.update({
      where: { id: req.id },
      data: {
        addresses: { connect: { id: address.id } },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Delivery address added successfully!",
      address,
    });
  }
});
