const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Seller = require("../model/seller");
const ErrorHandler = require("../utils/ErrorHandler");
const { uploadSeller } = require("../multer");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const bcrypt = require("bcryptjs");

// Create seller and send activation email
router.post("/create-seller", uploadSeller.single("file"), async (req, res, next) => {
  try {
    const { shopName, email, password, phone, zip } = req.body;

    if (!shopName || !email || !password) {
      return next(new ErrorHandler("Please provide shop name, email, and password", 400));
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      if (req.file) {
        fs.unlink(path.join("uploads", "sellers", req.file.filename), () => {});
      }
      return next(new ErrorHandler("Seller with this email already exists", 400));
    }

    const avatar = req.file ? path.join("sellers", req.file.filename) : "";
    const sellerData = { shopName, email, password, phone, zip, avatar };
    const activationToken = createActivationToken(sellerData);
    const activationUrl = `http://localhost:3000/seller-activation/${activationToken}`;

    try {
      await sendMail({
        email: sellerData.email,
        subject: "Activate Your Seller Account - Lumen Market",
        message: `Hello ${sellerData.shopName},\n\nPlease click on the link below to activate your seller account:\n${activationUrl}\n\nThis link will expire in 5 minutes.\n\nBest regards,\nLumen Market Team`,
      });

      return res.status(201).json({
        success: true,
        message: `Activation email has been sent to ${sellerData.email}. Please check your inbox to complete registration.`,
      });
    } catch (error) {
      return next(new ErrorHandler("Activation email could not be sent. Please try again.", 500));
    }
  } catch (error) {
    return next(error);
  }
});

// Activate seller with token and create account
router.post("/activation-seller", catchAsyncError(async (req, res, next) => {
  try {
    const { activation_token } = req.body;
    let newSeller;

    try {
      newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    } catch (e) {
      return next(new ErrorHandler("Activation link has expired. Please sign up again.", 400));
    }

    const { shopName, email, password, phone, zip, avatar } = newSeller;
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return next(new ErrorHandler("Seller already activated or registered", 400));
    }

    await Seller.create({
      shopName,
      email,
      password,
      phone,
      zip,
      avatar,
    });

    res.status(201).json({
      success: true,
      message: "Seller account activated. You can now sign in.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// Seller login
router.post("/login-seller", catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  const seller = await Seller.findOne({ email }).select("+password");
  if (!seller) return next(new ErrorHandler("Seller not found with this email", 400));

  const isValid = await bcrypt.compare(password, seller.password);
  if (!isValid) return next(new ErrorHandler("Invalid password", 400));

  sendToken(seller, 200, res);
}));

const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

module.exports = router;
