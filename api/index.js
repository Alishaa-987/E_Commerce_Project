const serverless = require("serverless-http");
const path = require("path");
const express = require("express");
const { connectionDatabase } = require("../backend/db/Database");
const user = require("../backend/controller/user");
const seller = require("../backend/controller/seller");
const product = require("../backend/controller/product");
const event = require("../backend/controller/event");
const order = require("../backend/controller/order");
const payment = require("../backend/controller/payment");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: path.join(__dirname, "../backend/config/.env"),
  });
}

// DB Connection (cached)
let dbConnected = false;
const connectDB = async () => {
  if (!dbConnected) {
    await connectionDatabase();
    dbConnected = true;
  }
};

// App
const app = express();
app.set('trust proxy', true);
app.use(express.json());

// Routes
app.use("/api/v2/user", user);
app.use("/api/v2/seller", seller);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/order", order);
app.use("/api/v2/payment", payment);

// Serve React build in production
if (process.env.NODE_ENV === "PRODUCTION") {
  const buildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

module.exports = async (req, res) => {
  await connectDB();
  return serverless(app)(req, res);
};