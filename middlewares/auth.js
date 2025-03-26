const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const { catchAsyncErrors } = require("./catchAsyncErrors");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(new ErrorHandler("Please Login To Access The Resources", 401));
  }
  const { id } = jwt.verify(accessToken, process.env.JWT_SECRET);
  console.log(id);

  req.id = id;
  next();
});

exports.isAdmin = catchAsyncErrors(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(new ErrorHandler("Please Login To Access The Resources", 401));
  }
  const { id, isAdmin } = jwt.verify(accessToken, process.env.JWT_SECRET);

  if (!isAdmin) {
    return next(
      new ErrorHandler("Access denied. Admin privileges required.", 403)
    );
  }
  req.id = id;
  next();
});
