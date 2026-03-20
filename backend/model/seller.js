const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sellerSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: [true, "Please enter your shop name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password should be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

sellerSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "90d",
  });
};

sellerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

sellerSchema.pre("save", async function save() {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("Seller", sellerSchema);
