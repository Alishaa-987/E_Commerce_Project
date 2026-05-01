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
const SHOPS = [
  {
    shopName: "Luxe & Co.",
    email: "luxeco@shop.com",
    password: "Shop@1234",
    phone: "+92 300 1111111",
    address: "Lahore, Pakistan",
    zip: "54000",
    description: "Premium fashion and lifestyle products for the modern individual.",
    avatar: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    banner: "https://res.cloudinary.com/demo/image/upload/v1580125016/docs/sea_turtle.jpg",
    handle: "luxe-and-co",
    products: [
      {
        name: "Classic Leather Handbag",
        description: "A timeless tan leather handbag with gold hardware, perfect for everyday elegance.",
        category: "Bags",
        tags: "leather,handbag,luxury,fashion",
        price: 89.99,
        orignalPrice: 129.99,
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
        ],
      },
      {
        name: "Silk Evening Dress",
        description: "Gorgeous midnight blue silk evening dress with a flowing silhouette.",
        category: "Clothing",
        tags: "dress,silk,evening,women",
        price: 149.99,
        orignalPrice: 199.99,
        stock: 15,
        images: [
          "https://images.unsplash.com/photo-1566479179817-9f60d1c3a9f5?w=800",
          "https://images.unsplash.com/photo-1596993100471-c3905dbd6b6b?w=800",
        ],
      },
      {
        name: "Gold Minimalist Watch",
        description: "Sleek minimalist watch with a gold case and a clean white dial.",
        category: "Accessories",
        tags: "watch,gold,minimalist,luxury",
        price: 199.99,
        orignalPrice: 249.99,
        stock: 20,
        images: [
          "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        ],
      },
      {
        name: "Cashmere Wool Scarf",
        description: "Ultra-soft cashmere scarf in a neutral beige tone, perfect for all seasons.",
        category: "Accessories",
        tags: "scarf,cashmere,wool,winter",
        price: 59.99,
        orignalPrice: 79.99,
        stock: 50,
        images: [
          "https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=800",
        ],
      },
    ],
  },
  {
    shopName: "TechNest",
    email: "technest@shop.com",
    password: "Shop@1234",
    phone: "+92 301 2222222",
    address: "Karachi, Pakistan",
    zip: "75600",
    description: "Your one-stop destination for cutting-edge gadgets and electronics.",
    avatar: "https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill/sample.jpg",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    handle: "technest",
    products: [
      {
        name: "Wireless Noise-Cancelling Headphones",
        description: "Premium wireless over-ear headphones with 40-hour battery and active noise cancellation.",
        category: "Electronics",
        tags: "headphones,wireless,audio,noise-cancelling",
        price: 149.99,
        orignalPrice: 199.99,
        stock: 40,
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
        ],
      },
      {
        name: "Smart LED Desk Lamp",
        description: "Touch-sensitive smart lamp with adjustable colour temperature and USB charging port.",
        category: "Electronics",
        tags: "lamp,led,smart,desk",
        price: 49.99,
        orignalPrice: 69.99,
        stock: 60,
        images: [
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
        ],
      },
      {
        name: "Mechanical Keyboard",
        description: "Compact TKL mechanical keyboard with blue switches and RGB backlighting.",
        category: "Electronics",
        tags: "keyboard,mechanical,rgb,gaming",
        price: 89.99,
        orignalPrice: 119.99,
        stock: 25,
        images: [
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800",
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800",
        ],
      },
      {
        name: "USB-C Hub 7-in-1",
        description: "Multi-port USB-C hub with HDMI 4K, SD card slot, and 3 USB 3.0 ports.",
        category: "Electronics",
        tags: "usb-c,hub,adapter,laptop",
        price: 39.99,
        orignalPrice: 54.99,
        stock: 75,
        images: [
          "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=800",
        ],
      },
    ],
  },
  {
    shopName: "Huda Beauty",
    email: "hudabeauty@shop.com",
    password: "Shop@1234",
    phone: "+92 333 3333333",
    address: "Islamabad, Pakistan",
    zip: "44000",
    description: "Discover premium skincare and makeup products for a radiant you.",
    avatar: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=150&h=150&fit=crop",
    banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200",
    handle: "huda-beauty",
    products: [
      {
        name: "Rose Gold Eyeshadow Palette",
        description: "A stunning 18-shade rose gold palette with matte and shimmer finishes.",
        category: "Beauty",
        tags: "eyeshadow,palette,makeup,rose-gold",
        price: 44.99,
        orignalPrice: 59.99,
        stock: 35,
        images: [
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
        ],
      },
      {
        name: "Vitamin C Brightening Serum",
        description: "Potent 20% Vitamin C serum that fades dark spots and evens skin tone.",
        category: "Skincare",
        tags: "serum,vitamin-c,brightening,skincare",
        price: 34.99,
        orignalPrice: 49.99,
        stock: 50,
        images: [
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
        ],
      },
      {
        name: "Hydrating Lip Gloss Set",
        description: "A set of 6 hydrating lip glosses in versatile nude-to-berry shades.",
        category: "Beauty",
        tags: "lip-gloss,lips,makeup,hydrating",
        price: 24.99,
        orignalPrice: 34.99,
        stock: 80,
        images: [
          "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800",
        ],
      },
      {
        name: "Matte Foundation SPF 30",
        description: "Full-coverage matte foundation with SPF 30, available in 40 shades.",
        category: "Beauty",
        tags: "foundation,spf,matte,makeup",
        price: 39.99,
        orignalPrice: 54.99,
        stock: 45,
        images: [
          "https://images.unsplash.com/photo-1631214499478-4a2a2e5b8d42?w=800",
        ],
      },
    ],
  },
  {
    shopName: "Aurum Luxe",
    email: "aurumluxe@shop.com",
    password: "Shop@1234",
    phone: "+92 315 4444444",
    address: "Rawalpindi, Pakistan",
    zip: "46000",
    description: "Fine jewellery and premium accessories for every occasion.",
    avatar: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop",
    banner: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200",
    handle: "aurum-luxe",
    products: [
      {
        name: "Diamond Solitaire Ring",
        description: "A classic 0.5ct diamond solitaire ring set in 18k white gold.",
        category: "Jewellery",
        tags: "ring,diamond,gold,luxury",
        price: 499.99,
        orignalPrice: 649.99,
        stock: 10,
        images: [
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
          "https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800",
        ],
      },
      {
        name: "Pearl Drop Earrings",
        description: "Elegant freshwater pearl drop earrings with sterling silver hooks.",
        category: "Jewellery",
        tags: "earrings,pearl,silver,elegant",
        price: 69.99,
        orignalPrice: 89.99,
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
        ],
      },
      {
        name: "Gold Chain Bracelet",
        description: "Delicate 14k gold chain bracelet with adjustable length.",
        category: "Jewellery",
        tags: "bracelet,gold,chain,gift",
        price: 129.99,
        orignalPrice: 169.99,
        stock: 25,
        images: [
          "https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=800",
        ],
      },
    ],
  },
];

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

  // ── Step 3: Print credentials ──────────────────────────────────────────────
  console.log("\n✨ ══════════════════════════════════════════════════════ ✨");
  console.log("   SHOP CREDENTIALS (All shops use the same password)");
  console.log("✨ ══════════════════════════════════════════════════════ ✨\n");

  for (const shop of SHOPS) {
    console.log(`🏪  ${shop.shopName}`);
    console.log(`    Email   : ${shop.email}`);
    console.log(`    Password: ${shop.password}\n`);
  }

  console.log("✅ Seeding complete! Refresh your browser to see the changes.\n");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});
