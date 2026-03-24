const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static("uploads"));
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: `${__dirname}/config/.env`,
    });
}
// import routes

const user = require("./controller/user");
const seller = require("./controller/seller");
const product = require("./controller/product");
// const payment = require("./controller/payment");
// const order = require("./controller/order");

app.use("/api/v2/user", user);
app.use("/api/v2/seller", seller);
app.use("/api/v2/product", product);
// app.use("/api/v2/payment", payment);
// app.use("/api/v2/order", order);

app.use(ErrorHandler);
module.exports = app;
