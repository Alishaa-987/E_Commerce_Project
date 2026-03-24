const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const Seller = require("../model/seller");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create product
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncError(async (req, res, next) => {
    const seller = await Seller.findById(req.body.shopId);

    if (!seller) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    if (!req.files?.length) {
      return next(new ErrorHandler("Please upload at least one product image", 400));
    }

    const imageUrls = req.files.map((file) => file.filename);
    const productData = {
      ...req.body,
      images: imageUrls,
      shop: seller,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product,
    });
  })
);

module.exports = router;
