const jwt = require("jsonwebtoken");

const ErrorHandler = require("../utils/errorHandler");
const { catchAsyncErrors } = require("./catchAsyncErrors");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { accessToken } = req.cookies;
  // console.log(req.cookies);

  if (!accessToken) {
    return next(new ErrorHandler("Please Login To Access The Resources", 401));
  }
  const { id } = jwt.verify(accessToken, process.env.JWT_SECRET);
  req.id = id;
  next();
});
