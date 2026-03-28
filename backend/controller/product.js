const express = require("express");
const fs = require("fs");
const path = require("path");
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

// Get all products
router.get(
  "/get-all-products",
  catchAsyncError(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  })
);

// Get single product
router.get(
  "/get-product/:id",
  catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  })
);

// Get all products for a seller/shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncError(async (req, res) => {
    const products = await Product.find({ shopId: req.params.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  })
);

// Delete a seller/shop product
router.delete(
  "/delete-shop-product/:id",
  catchAsyncError(async (req, res, next) => {
    const filter = { _id: req.params.id };

    if (req.query.shopId) {
      filter.shopId = req.query.shopId;
    }

    const product = await Product.findOne(filter);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    await Promise.all(
      (product.images || []).map(async (image) => {
        try {
          await fs.promises.unlink(path.join("uploads", path.basename(image)));
        } catch {}
      })
    );
    await Product.deleteOne({ _id: product._id });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  })
);

module.exports = router;
