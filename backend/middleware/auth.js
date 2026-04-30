const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Seller = require("../model/seller");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    null;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("Your session is no longer valid. Please login again.", 401));
  }

  req.user = user;
  next();
});

exports.isSellerAuthenticated = catchAsyncError(async (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    null;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const seller = await Seller.findById(decoded.id).select("-password");

  if (!seller) {
    return next(new ErrorHandler("Seller session is no longer valid. Please login again.", 401));
  }

  req.seller = seller;
  next();
});
