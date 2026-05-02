/**
 * Seed Script - Clears old broken data and creates fresh shops + products
 * Run with: node backend/seed.js
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config/.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── Models ──────────────────────────────────────────────────────────────────
const Seller = require("./model/seller");
const Product = require("./model/product");
const Event = require("./model/event");

// ─── Seed Data ───────────────────────────────────────────────────────────────
// No default shops - sellers create their own shops during registration
const SHOPS = [];

// ─── Main Seeding Function ────────────────────────────────────────────────────
const seed = async () => {
  console.log("\n🚀 Connecting to MongoDB...");
  await mongoose.connect(process.env.DB_URL);
  console.log("✅ Connected!\n");

  // ── Step 1: Delete all existing sellers, products, events ─────────────────
  console.log("🗑️  Clearing existing shops, products and events...");
  await Promise.all([
    Seller.deleteMany({}),
    Product.deleteMany({}),
    Event.deleteMany({}),
  ]);
  console.log("✅ Cleared!\n");

  // ── Step 2: Create fresh shops and products ────────────────────────────────
  for (const shopData of SHOPS) {
    const hashedPassword = await bcrypt.hash(shopData.password, 10);

    // Create the seller
    const seller = await Seller.create({
      shopName: shopData.shopName,
      email: shopData.email,
      password: hashedPassword,
      phone: shopData.phone,
      address: shopData.address,
      zip: shopData.zip,
      description: shopData.description,
      avatar: shopData.avatar,
      banner: shopData.banner,
      handle: shopData.handle,
      followers: Math.floor(Math.random() * 500),
      rating: (Math.random() * 2 + 3).toFixed(1),
    });

    console.log(`🏪 Created shop: ${seller.shopName} (ID: ${seller._id})`);

    // Create products for this seller
    for (const productData of shopData.products) {
      await Product.create({
        name: productData.name,
        description: productData.description,
        category: productData.category,
        tags: productData.tags,
        discountPrice: productData.price,
        orignalPrice: productData.orignalPrice,
        stock: productData.stock,
        images: productData.images,
        shopId: seller._id,
        shop: seller._id,
        shopName: seller.shopName,
        sold_out: Math.floor(Math.random() * 20),
        rating: (Math.random() * 2 + 3).toFixed(1),
      });

      console.log(`   📦 Added product: ${productData.name}`);
    }
  }

  console.log("✅ Seeding complete! Sellers can now register their shops.\n");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});
