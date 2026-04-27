const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../model/product");
const Seller = require("../model/seller");
const Order = require("../model/order");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isAuthenticated } = require("../middleware/auth");

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

  // Submit review for a product
  router.post(
    "/submit-review",
    isAuthenticated,
    catchAsyncError(async (req, res, next) => {
      const { productId, rating, message, orderId } = req.body;

      if (!productId) {
        return next(new ErrorHandler("Product ID is required.", 400));
      }
      if (!rating || rating < 1 || rating > 5) {
        return next(new ErrorHandler("Rating must be between 1 and 5.", 400));
      }
      if (!message || !message.trim()) {
        return next(new ErrorHandler("Review message is required.", 400));
      }

      // Verify user has purchased this product and update order
      let hasPurchased = false;
      if (orderId) {
        const order = await Order.findOne({ _id: orderId, user: req.user._id });
        if (order) {
          const cartItem = order.cart.find(
            (item) => (item.id || item._id)?.toString() === productId.toString()
          );
          if (cartItem) {
            if (cartItem.reviewSubmitted) {
              return next(
                new ErrorHandler("You have already submitted a review for this product.", 400)
              );
            }
            hasPurchased = true;
            cartItem.reviewSubmitted = true;
            await order.save();
          }
        }
      }

      // Check if user has already reviewed this product (prevent duplicate reviews)
      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found.", 404));
      }

      // Check if user already has a review for this product
      const existingReview = product.reviews?.find(
        (review) => review.user.id?.toString() === req.user._id.toString()
      );
      if (existingReview) {
        return next(
          new ErrorHandler("You have already submitted a review for this product.", 400)
        );
      }

      const reviewEntry = {
        user: {
          id: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar || "",
        },
        rating: Number(rating),
        message: message.trim(),
        orderId: orderId || "",
        hasPurchased,
        createdAt: new Date(),
      };

      // Add review to product
      if (!product.reviews) {
        product.reviews = [];
      }
      product.reviews.push(reviewEntry);

      // Recalculate overall rating
      const totalRating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      product.rating = Number((totalRating / product.reviews.length).toFixed(1));

      await product.save();

      // Emit real-time event for new review
      const io = req.app.get("io");
      if (io) {
        io.emit("newReview", { productId, review: reviewEntry });
        io.emit("productUpdated", { productId: product._id, rating: product.rating, reviewsCount: product.reviews.length });
      }

      res.status(201).json({
        success: true,
        message: "Review submitted successfully.",
        review: reviewEntry,
        productRating: product.rating,
        reviewsCount: product.reviews.length,
      });
    })
  );

module.exports = router;