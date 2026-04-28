const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static("uploads"));
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);




// import routes

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

module.exports = app;
