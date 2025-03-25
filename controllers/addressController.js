const { PrismaClient } = require("@prisma/client");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const prisma = new PrismaClient();

exports.createAddress = catchAsyncErrors(async (req, res, next) => {
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
  } = req.body;

  if (
    !name ||
    !phone ||
    !email ||
    !flatNo ||
    !area ||
    !pincode ||
    !city ||
    !state ||
    !country ||
    !addressType
  ) {
    return next(
      new ErrorHandler("Please provide all required address details.", 400)
    );
  }

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
