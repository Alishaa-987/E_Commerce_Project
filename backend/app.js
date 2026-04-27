const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const __agentDebugLogPathPrimary = path.resolve(__dirname, "..", ".cursor", "debug-24c389.log");
const __agentDebugLogPathFallback = path.join(process.cwd(), ".cursor", "debug-24c389.log");
const __agentLog = (payload) => {
    try {
        fs.mkdirSync(path.dirname(__agentDebugLogPathPrimary), { recursive: true });
        fs.appendFileSync(__agentDebugLogPathPrimary, `${JSON.stringify(payload)}\n`, "utf8");
    } catch (_) {}
    try {
        fs.mkdirSync(path.dirname(__agentDebugLogPathFallback), { recursive: true });
        fs.appendFileSync(__agentDebugLogPathFallback, `${JSON.stringify(payload)}\n`, "utf8");
    } catch (_) {}
};

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

app.use((req, _res, next) => {
    try {
        // #region agent log
        const url = String(req.originalUrl || req.url || "");
        const isCreateOrder = url.includes("/api/v2/order/create-order");
        __agentLog({
            sessionId: "24c389",
            runId: "pre-fix",
            hypothesisId: "H6",
            location: "backend/app.js",
            message: isCreateOrder ? "Incoming create-order request" : "Incoming request",
            data: isCreateOrder
                ? {
                      method: String(req.method || ""),
                      url,
                      bodyType: typeof req.body,
                      bodyKeys: req.body && typeof req.body === "object" ? Object.keys(req.body).slice(0, 30) : null,
                      cartLen: Array.isArray(req.body?.cart) ? req.body.cart.length : null,
                      cart0Keys:
                          Array.isArray(req.body?.cart) && req.body.cart[0] && typeof req.body.cart[0] === "object"
                              ? Object.keys(req.body.cart[0]).slice(0, 30)
                              : null,
                      cart0HasShop: Boolean(req.body?.cart?.[0]?.shop),
                      cart0ShopType: typeof req.body?.cart?.[0]?.shop,
                      cart0ShopKeys:
                          req.body?.cart?.[0]?.shop && typeof req.body.cart[0].shop === "object"
                              ? Object.keys(req.body.cart[0].shop).slice(0, 20)
                              : null,
                      cart0ShopId: String(req.body?.cart?.[0]?.shopId || req.body?.cart?.[0]?.shop?._id || ""),
                  }
                : { method: String(req.method || ""), url },
            timestamp: Date.now(),
        });
        // #endregion agent log
    } catch (_) {}
    next();
});

app.post("/api/v2/__agent/debug-log", (req, res) => {
    try {
        // #region agent log
        __agentLog({
            sessionId: "24c389",
            runId: String(req.body?.runId || "unknown"),
            hypothesisId: String(req.body?.hypothesisId || "agent"),
            location: String(req.body?.location || "client"),
            message: String(req.body?.message || "client-log"),
            data:
                req.body && typeof req.body === "object"
                    ? req.body?.data ?? null
                    : null,
            timestamp: Number(req.body?.timestamp) || Date.now(),
        });
        // #endregion agent log
    } catch (_) {}
    res.status(204).end();
});

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: `${__dirname}/config/.env`,
    });
}
// import routes

const user = require("./controller/user");
const seller = require("./controller/seller");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/couponCode");
const payment = require("./controller/payment");
const order = require("./controller/order");

app.use("/api/v2/user", user);
app.use("/api/v2/seller", seller);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);

app.use(ErrorHandler);
module.exports = app;
