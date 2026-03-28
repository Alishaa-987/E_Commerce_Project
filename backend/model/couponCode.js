const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your coupon name"],
    trim: true,
  },
  value: {
    type: Number,
    required: [true, "Please enter your discount percentage"],
  },
  minAmount: {
    type: Number,
  },
  maxAmount: {
    type: Number,
  },
  selectedProductId: {
    type: String,
    default: "",
  },
  selectedProductName: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
    trim: true,
  },
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CouponCode", couponCodeSchema);
