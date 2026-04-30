const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectionDatabase } = require("./db/Database");
const path = require("path");

let dbConnected = false;

const connectDB = async () => {
  if (!dbConnected) {
    await connectionDatabase();
    dbConnected = true;
  }
};

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: path.join(__dirname, "config/.env"),
  });
}

connectDB().catch(console.error);

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://multivendor-shop-1.vercel.app",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const user = require("./controller/user");
const seller = require("./controller/seller");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/couponCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");

app.use("/api/v2/user", user);
app.use("/api/v2/seller", seller);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);

app.use(ErrorHandler);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

module.exports = app;