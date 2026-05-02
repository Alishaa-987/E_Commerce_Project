/**
 * Seed Script - Clears existing data
 * Run with: node backend/seed.js
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config/.env") });

const mongoose = require("mongoose");
const Seller = require("./model/seller");
const Product = require("./model/product");
const Event = require("./model/event");

const seed = async () => {
  console.log("\n🚀 Connecting to MongoDB...");
  await mongoose.connect(process.env.DB_URL);
  console.log("✅ Connected!\n");

  console.log("🗑️  Clearing existing shops, products and events...");
  await Promise.all([
    Seller.deleteMany({}),
    Product.deleteMany({}),
    Event.deleteMany({}),
  ]);
  console.log("✅ Cleared!\n");

  console.log("✅ Seeding complete! Sellers can now register their shops.\n");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});