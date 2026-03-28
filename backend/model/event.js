const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your event name"],
  },
  description: {
    type: String,
    required: [true, "Please enter your event description"],
  },
  category: {
    type: String,
    required: [true, "Please enter your event category"],
  },
  startDate: {
    type: Date,
    required: [true, "Please enter your event start date"],
  },
  endDate: {
    type: Date,
    required: [true, "Please enter your event end date"],
  },
  tags: {
    type: String,
    default: "",
  },
  couponCode: {
    type: String,
    default: "",
    trim: true,
  },
  orignalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your event price"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter your event stock"],
  },
  images: [
    {
      type: String,
    },
  ],
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
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", eventSchema);
