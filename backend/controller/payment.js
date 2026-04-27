const express = require("express");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated } = require("../middleware/auth");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const DEFAULT_PAYMENT_CURRENCY = String(
  process.env.STRIPE_CURRENCY || "usd"
).toLowerCase();

const toNumber = (value, fallback = 0) => {
  const normalizedValue = Number(value);
  return Number.isFinite(normalizedValue) ? normalizedValue : fallback;
};

const toCents = (amount) => Math.round(toNumber(amount) * 100);

const getItemQuantity = (item = {}) => {
  const quantity = Math.floor(toNumber(item.qty, 1));
  return quantity > 0 ? quantity : 1;
};

const calculateCartSubtotalInCents = (cart = []) =>
  cart.reduce(
    (sum, item) => sum + toCents(item?.price) * getItemQuantity(item),
    0
  );

/**
 * POST /process
 * Create a Stripe PaymentIntent
 * @param {number} amount - Amount in cents (e.g., 5000 for $50.00)
 * @returns {object} - PaymentIntent client secret
 */
router.post(
  "/process",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const {
      amount,
      cart = [],
      shippingAmount = 0,
      couponDiscount = 0,
      totalPrice,
      currency = DEFAULT_PAYMENT_CURRENCY,
    } = req.body;

    const requestedAmountInCents = Math.round(toNumber(amount));
    const subtotalInCents = calculateCartSubtotalInCents(cart);
    const shippingAmountInCents = toCents(shippingAmount);
    const couponDiscountInCents = toCents(couponDiscount);
    const expectedTotalInCents = Math.max(
      subtotalInCents + shippingAmountInCents - couponDiscountInCents,
      0
    );
    const normalizedCurrency = String(currency || DEFAULT_PAYMENT_CURRENCY)
      .trim()
      .toLowerCase();
    const itemCount = Array.isArray(cart)
      ? cart.reduce((sum, item) => sum + getItemQuantity(item), 0)
      : 0;
    const submittedTotalInCents = toCents(totalPrice);

    if (!Array.isArray(cart) || cart.length === 0) {
      return next(new ErrorHandler("Cart is empty or invalid.", 400));
    }

    if (expectedTotalInCents <= 0) {
      return next(new ErrorHandler("Invalid payment amount.", 400));
    }

    if (
      requestedAmountInCents > 0 &&
      Math.abs(requestedAmountInCents - expectedTotalInCents) > 1
    ) {
      return next(
        new ErrorHandler("Payment amount does not match the order total.", 400)
      );
    }

    if (
      submittedTotalInCents > 0 &&
      Math.abs(submittedTotalInCents - expectedTotalInCents) > 1
    ) {
      return next(
        new ErrorHandler("Order total does not match the checkout summary.", 400)
      );
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: expectedTotalInCents,
        currency: normalizedCurrency,
        payment_method_types: ["card"],
        metadata: {
          company: "Lumen Marketplace",
          userId: String(req.user?._id || ""),
          email: String(req.user?.email || ""),
          itemCount: String(itemCount),
          subtotal: (subtotalInCents / 100).toFixed(2),
          shipping: (shippingAmountInCents / 100).toFixed(2),
          couponDiscount: (couponDiscountInCents / 100).toFixed(2),
          orderTotal: (expectedTotalInCents / 100).toFixed(2),
        },
      });

      res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });
    } catch (stripeError) {
      return next(
        new ErrorHandler(
          stripeError.message || "Payment processing failed.",
          400
        )
      );
    }
  })
);

/**
 * GET /stripeapikey
 * Retrieve Stripe publishable API key for frontend
 * @returns {object} - Stripe API key
 */
router.get(
    "/stripeapikey",
    catchAsyncError(async (req, res, next) => {
        if (!process.env.STRIPE_API_KEY) {
            return next(new ErrorHandler("Stripe API key not configured.", 500));
        }

        res.status(200).json({
            stripeApiKey: process.env.STRIPE_API_KEY,
        });
    })
);

module.exports = router;
