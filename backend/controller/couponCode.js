const express = require("express");
const router = express.Router();
const CouponCode = require("../model/couponCode");
const Seller = require("../model/seller");
const Product = require("../model/product");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

router.post(
  "/create-coupon-code",
  catchAsyncError(async (req, res, next) => {
    const { name, value, minAmount, maxAmount, selectedProductId, category, shopId } = req.body;

    if (!name || value === undefined || !selectedProductId || !category || !shopId) {
      return next(
        new ErrorHandler(
          "Name, discount percentage, selected product, and category are required. Min and max amount are optional.",
          400
        )
      );
    }

    const seller = await Seller.findById(shopId);
    if (!seller) {
      return next(new ErrorHandler("Shop not found", 404));
    }

    const product = await Product.findOne({ _id: selectedProductId, shopId });
    if (!product) {
      return next(new ErrorHandler("Selected product not found", 404));
    }

    const discountValue = Number(value);
    const minimumAmount =
      minAmount === "" || minAmount === undefined ? undefined : Number(minAmount);
    const maximumAmount =
      maxAmount === "" || maxAmount === undefined ? undefined : Number(maxAmount);

    if (Number.isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      return next(new ErrorHandler("Discount percentage must be between 1 and 100", 400));
    }

    if (
      minimumAmount !== undefined &&
      (Number.isNaN(minimumAmount) || minimumAmount < 0)
    ) {
      return next(new ErrorHandler("Minimum amount must be 0 or more", 400));
    }

    if (
      maximumAmount !== undefined &&
      (Number.isNaN(maximumAmount) || maximumAmount < 0)
    ) {
      return next(new ErrorHandler("Maximum amount must be 0 or more", 400));
    }

    if (
      minimumAmount !== undefined &&
      maximumAmount !== undefined &&
      maximumAmount < minimumAmount
    ) {
      return next(
        new ErrorHandler("Maximum amount must be greater than or equal to minimum amount", 400)
      );
    }

    const normalizedName = String(name).trim().toUpperCase();

    const existingCoupon = await CouponCode.findOne({
      shopId,
      name: normalizedName,
    });

    if (existingCoupon) {
      return next(new ErrorHandler("Coupon code already exists for this shop", 400));
    }

    const couponCode = await CouponCode.create({
      name: normalizedName,
      value: discountValue,
      minAmount: minimumAmount,
      maxAmount: maximumAmount,
      selectedProductId: String(product._id),
      selectedProductName: product.name,
      category: String(category).trim(),
      shopId,
      shop: seller,
    });

    res.status(201).json({
      success: true,
      couponCode,
    });
  })
);

router.get(
  "/get-all-coupon-codes-shop/:id",
  catchAsyncError(async (req, res) => {
    const couponCodes = await CouponCode.find({ shopId: req.params.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      couponCodes,
    });
  })
);

module.exports = router;
