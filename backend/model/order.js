const mongoose = require("mongoose");

const paymentInfoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      default: "pending",
      trim: true,
    },
    type: {
      type: String,
      default: "card",
      trim: true,
    },
    stripePaymentIntentId: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
    id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: [
      {
        // Product details
        name: { type: String, required: true },
        description: { type: String },
        images: [{ type: String }],
        shop: { type: Object },
        shopId: { type: String, required: true },
        discountPrice: { type: Number },
        qty: { type: Number, required: true },
        // Review status
        reviewSubmitted: { type: Boolean, default: false },
        // Link to the product
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    paymentInfo: {
      type: paymentInfoSchema,
      default: () => ({}),
    },
    paidAt: {
      type: Date,
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    adjustmentAmount: {
      type: Number,
      default: 0,
    },
    groupTotalPrice: {
      type: Number,
      default: 0,
    },
    orderGroupId: {
      type: String,
      default: "",
      index: true,
      trim: true,
    },
    shopId: {
      type: String,
      default: "",
      index: true,
      trim: true,
    },
    shopName: {
      type: String,
      default: "",
      trim: true,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "cod"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "succeeded", "failed", "cancelled"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    deliveredAt: Date,
    // Refund information
    refund: {
      requested: { type: Boolean, default: false },
      status: { 
        type: String, 
        enum: ["pending", "processing", "approved", "rejected", "refunded"], 
        default: "pending" 
      },
      reason: { type: String, default: "" },
      requestedAt: Date,
      processedAt: Date,
      refundAmount: { type: Number, default: 0 },
      notes: { type: String, default: "" }
    },
    // Track shop orders separately
    shopOrders: [
      {
        shopId: String,
        shopName: String,
        items: Array,
        subTotal: Number,
        totalPrice: Number,
        adjustmentAmount: Number,
        itemCount: Number,
        status: {
          type: String,
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
          default: "pending",
        },
        shippedAt: Date,
        deliveredAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
