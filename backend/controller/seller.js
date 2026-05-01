const express = require("express");
const router = express.Router();
const Seller = require("../model/seller");
const Product = require("../model/product");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload, uploadToCloudinary } = require("../multer");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isSellerAuthenticated } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildUniqueSellerHandle = async (shopName, excludeId = null) => {
  const baseHandle = slugify(shopName) || `shop-${Date.now()}`;
  let handle = baseHandle;
  let suffix = 1;

  while (
    await Seller.findOne({
      handle,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    handle = `${baseHandle}-${suffix}`;
    suffix += 1;
  }

  return handle;
};

const ensureSellerDefaults = async (seller) => {
  if (!seller) {
    return null;
  }

  let shouldSave = false;

  if (!seller.handle) {
    seller.handle = await buildUniqueSellerHandle(seller.shopName, seller._id);
    shouldSave = true;
  }

  if (seller.address === undefined) {
    seller.address = "";
    shouldSave = true;
  }

  if (seller.description === undefined) {
    seller.description = "";
    shouldSave = true;
  }

  if (seller.banner === undefined) {
    seller.banner = "";
    shouldSave = true;
  }

  if (seller.followers === undefined) {
    seller.followers = 0;
    shouldSave = true;
  }

  if (seller.rating === undefined) {
    seller.rating = 0;
    shouldSave = true;
  }

  if (shouldSave) {
    await seller.save();
  }

  return seller;
};

const attachProductCounts = async (sellers) => {
  const productCounts = await Product.aggregate([
    {
      $group: {
        _id: "$shopId",
        count: { $sum: 1 },
      },
    },
  ]);

  const productCountMap = new Map(
    productCounts.map((item) => [String(item._id), item.count])
  );

  return sellers.map((seller) => {
    const plainSeller = seller.toObject ? seller.toObject() : seller;

    return {
      ...plainSeller,
      productCount: productCountMap.get(String(plainSeller._id)) || 0,
    };
  });
};

// Create seller and send activation email
router.post("/create-seller", upload.single("file"), async (req, res, next) => {
  try {
    const { shopName, email, password, phone, zip } = req.body;

    if (!shopName || !email || !password) {
      return next(new ErrorHandler("Please provide shop name, email, and password", 400));
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return next(new ErrorHandler("Seller with this email already exists", 400));
    }

    let avatarUrl = "";
    if (req.file) {
      try {
        avatarUrl = await uploadToCloudinary(req.file.buffer, "sellers");
      } catch (uploadError) {
        console.error("Error uploading avatar:", uploadError);
      }
    }

    const sellerData = { shopName, email, password, phone, zip, avatar: avatarUrl };
    const activationToken = createActivationToken(sellerData);
    const activationUrl = `${process.env.CLIENT_URL || "https://e-commerce-project-vs2l.vercel.app"}/seller-activation/${activationToken}`;

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
      handle: await buildUniqueSellerHandle(shopName),
      email,
      password,
      phone,
      address: "",
      zip,
      description: "",
      avatar,
      banner: "",
      followers: 0,
      rating: 0,
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

  await ensureSellerDefaults(seller);
  seller.password = undefined;
  sendToken(seller, 200, res);
}));

router.get("/get-seller-info/:id", catchAsyncError(async (req, res, next) => {
  const seller = await Seller.findById(req.params.id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  await ensureSellerDefaults(seller);
  const [sellerWithCount] = await attachProductCounts([seller]);

  res.status(200).json({
    success: true,
    seller: sellerWithCount,
  });
}));

router.get("/get-shop/:handle", catchAsyncError(async (req, res, next) => {
  const sellers = await Seller.find();
  const seller = sellers.find(
    (item) => (item.handle || slugify(item.shopName)) === req.params.handle
  );

  if (!seller) {
    return next(new ErrorHandler("Shop not found", 404));
  }

  await ensureSellerDefaults(seller);
  const [sellerWithCount] = await attachProductCounts([seller]);

  res.status(200).json({
    success: true,
    seller: sellerWithCount,
  });
}));

router.get("/get-all-sellers", catchAsyncError(async (req, res) => {
  const sellers = await Seller.find().sort({ createdAt: -1 });
  const normalizedSellers = await Promise.all(
    sellers.map((seller) => ensureSellerDefaults(seller))
  );
  const sellersWithCounts = await attachProductCounts(normalizedSellers);

  res.status(200).json({
    success: true,
    sellers: sellersWithCounts,
  });
}));

router.put("/update-seller-info", isSellerAuthenticated, catchAsyncError(async (req, res, next) => {
  const { shopName, email, phone, address, description, zip } = req.body;
  const seller = await Seller.findById(req.seller._id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  if (shopName) seller.shopName = shopName;
  if (email) seller.email = email;
  if (phone) seller.phone = phone;
  if (address !== undefined) seller.address = address;
  if (description !== undefined) seller.description = description;
  if (zip) seller.zip = zip;

  await seller.save();
  await ensureSellerDefaults(seller);

  res.status(200).json({
    success: true,
    seller,
  });
}));

router.put("/update-seller-password", isSellerAuthenticated, catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const seller = await Seller.findById(req.seller._id).select("+password");

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, seller.password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Current password does not match", 400));
  }

  seller.password = newPassword;
  await seller.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully!",
  });
}));

const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

module.exports = router;
