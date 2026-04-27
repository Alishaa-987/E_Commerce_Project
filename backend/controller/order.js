const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const VALID_PAYMENT_METHODS = ["card", "paypal", "cod"];

const normalizePaymentMethod = (paymentMethod = "card") => {
  const normalizedPaymentMethod = String(paymentMethod || "card")
    .trim()
    .toLowerCase();

  return VALID_PAYMENT_METHODS.includes(normalizedPaymentMethod)
    ? normalizedPaymentMethod
    : "card";
};

const normalizePaymentInfo = (paymentInfo, paymentMethod) => {
  if (typeof paymentInfo === "string") {
    const normalizedStatus = String(paymentInfo || "pending")
      .trim()
      .toLowerCase();

    return {
      id: "",
      status: normalizedStatus || "pending",
      type: paymentMethod,
      stripePaymentIntentId: "",
    };
  }

  const info = paymentInfo && typeof paymentInfo === "object" ? paymentInfo : {};
  const id = String(info.id || info.stripePaymentIntentId || "").trim();
  const status = String(info.status || "pending")
    .trim()
    .toLowerCase();

  return {
    id,
    status: status || "pending",
    type: normalizePaymentMethod(info.type || paymentMethod),
    stripePaymentIntentId: String(info.stripePaymentIntentId || id).trim(),
  };
};

const mapPaymentStatus = (paymentStatus = "pending") => {
  if (paymentStatus === "succeeded") return "completed";
  if (paymentStatus === "processing") return "pending";
  if (paymentStatus === "requires_action") return "pending";
  return paymentStatus || "pending";
};

const roundCurrency = (value = 0) => Number(Number(value || 0).toFixed(2));

/**
 * Group cart items by shop
 * @param {Array} cartItems - Array of cart items with shopId or shop info
 * @returns {Object} - Items grouped by shop
 */
const groupItemsByShop = (cartItems = []) => {
  const grouped = {};

  cartItems.forEach((item) => {
    const shopId = item.shopId || item.shop?._id || "unknown-shop";
    const shopName = item.shopName || item.shop?.name || "Unknown Shop";

    if (!grouped[shopId]) {
      grouped[shopId] = {
        shopId: String(shopId),
        shopName,
        items: [],
        subTotal: 0,
        itemCount: 0,
      };
    }

    grouped[shopId].items.push(item);
    grouped[shopId].subTotal += (item.price || 0) * (item.qty || 1);
    grouped[shopId].itemCount += Number(item.qty || 1);
  });

  return Object.values(grouped).map((shopOrder) => ({
    ...shopOrder,
    subTotal: roundCurrency(shopOrder.subTotal),
  }));
};

const allocateShopOrderTotals = (shopOrders = [], groupTotal = 0) => {
  if (!shopOrders.length) {
    return [];
  }

  const normalizedGroupTotal = roundCurrency(groupTotal);
  const groupSubTotal = roundCurrency(
    shopOrders.reduce((sum, shopOrder) => sum + Number(shopOrder.subTotal || 0), 0)
  );
  let distributedTotal = 0;

  return shopOrders.map((shopOrder, index) => {
    let allocatedTotal = 0;

    if (index === shopOrders.length - 1) {
      allocatedTotal = roundCurrency(normalizedGroupTotal - distributedTotal);
    } else if (groupSubTotal > 0) {
      allocatedTotal = roundCurrency(
        (Number(shopOrder.subTotal || 0) / groupSubTotal) * normalizedGroupTotal
      );
    } else {
      allocatedTotal = roundCurrency(normalizedGroupTotal / shopOrders.length);
    }

    distributedTotal = roundCurrency(distributedTotal + allocatedTotal);

    return {
      ...shopOrder,
      totalPrice: allocatedTotal,
      adjustmentAmount: roundCurrency(allocatedTotal - Number(shopOrder.subTotal || 0)),
    };
  });
};

/**
 * POST /create-order
 * Create order with cart items and handle multi-shop orders
 */
router.post(
  "/create-order",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const {
      cart,
      shippingAddress,
      paymentInfo,
      totalPrice,
      paymentMethod,
    } = req.body;


    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return next(new ErrorHandler("Cart is empty or invalid.", 400));
    }

    if (!shippingAddress) {
      return next(new ErrorHandler("Shipping address is required.", 400));
    }

    if (typeof totalPrice !== "number" || totalPrice < 0) {
      return next(new ErrorHandler("Invalid total price.", 400));
    }

    try {
      const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
      const normalizedPaymentInfo = normalizePaymentInfo(
        paymentInfo,
        normalizedPaymentMethod
      );

      if (
        normalizedPaymentMethod === "card" &&
        totalPrice > 0 &&
        normalizedPaymentInfo.status === "succeeded" &&
        !normalizedPaymentInfo.stripePaymentIntentId
      ) {
        return next(
          new ErrorHandler("Missing Stripe payment confirmation for card payment.", 400)
        );
      }

      // Split the checkout into one saved order per shop.
      const groupedShopOrders = groupItemsByShop(cart);
      const shopOrders = allocateShopOrderTotals(groupedShopOrders, totalPrice);
      const mappedPaymentStatus = mapPaymentStatus(normalizedPaymentInfo.status);
      const isPaymentSuccessful = normalizedPaymentInfo.status === "succeeded";
      const orderStatus = isPaymentSuccessful ? "processing" : "pending";
      const orderGroupId = new mongoose.Types.ObjectId().toString();


      const ordersToCreate = shopOrders.map((shopOrder) => ({
        user: req.user._id,
        cart: shopOrder.items,
        shippingAddress,
        paymentInfo: normalizedPaymentInfo,
        paidAt: isPaymentSuccessful ? new Date() : null,
        subTotal: roundCurrency(shopOrder.subTotal),
        totalPrice: roundCurrency(shopOrder.totalPrice),
        adjustmentAmount: roundCurrency(shopOrder.adjustmentAmount),
        groupTotalPrice: roundCurrency(totalPrice),
        orderGroupId,
        shopId: String(shopOrder.shopId || ""),
        shopName: shopOrder.shopName || "Unknown Shop",
        itemCount: Number(shopOrder.itemCount || 0),
        paymentMethod: normalizedPaymentMethod,
        paymentStatus: mappedPaymentStatus,
        orderStatus,
        shopOrders: [
          {
            shopId: String(shopOrder.shopId || ""),
            shopName: shopOrder.shopName || "Unknown Shop",
            items: shopOrder.items,
            subTotal: roundCurrency(shopOrder.subTotal),
            totalPrice: roundCurrency(shopOrder.totalPrice),
            adjustmentAmount: roundCurrency(shopOrder.adjustmentAmount),
            itemCount: Number(shopOrder.itemCount || 0),
            status: orderStatus,
          },
        ],
      }));

      const orders = await Order.insertMany(ordersToCreate);
      const primaryOrder = orders[0] || null;
      const shopCount = orders.length;

      res.status(201).json({
        success: true,
        message:
          shopCount > 1
            ? `${shopCount} shop orders created successfully.`
            : "Order created successfully.",
        order: primaryOrder,
        orders,
        orderGroupId,
        shopCount,
      });
    } catch (error) {
      const statusCode = error.name === "ValidationError" ? 400 : 500;
      return next(
        new ErrorHandler(error.message || "Order creation failed.", statusCode)
      );
    }
  })
);

/**
 * GET /user-orders
 * Get all orders for authenticated user
 */
router.get(
  "/user-orders",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate("user", "name email phoneNumber")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Failed to fetch orders.", 500));
    }
  })
);

/**
 * GET /seller-orders/:shopId
 * Get all orders for a specific shop
 */
router.get(
  "/seller-orders/:shopId",
  catchAsyncError(async (req, res, next) => {
    try {
      const shopId = String(req.params.shopId || "").trim();

      if (!shopId) {
        return next(new ErrorHandler("Shop id is required.", 400));
      }

      const orders = await Order.find({ shopId })
        .populate("user", "name email phoneNumber")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(
        new ErrorHandler(error.message || "Failed to fetch seller orders.", 500)
      );
    }
  })
);

/**
 * GET /order/:id
 * Get single order details with authorization check
 */
router.get(
  "/order/:id",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id).populate(
        "user",
        "name email phoneNumber"
      );

      if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
      }

      // Authorization: only user who placed order can view it
      if (String(order.user._id) !== String(req.user._id)) {
        return next(
          new ErrorHandler("You are not authorized to view this order.", 403)
        );
      }

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Failed to fetch order.", 500));
    }
  })
);

/**
 * GET /order/:id/shop-orders
 * Get shop orders breakdown for a specific order
 */
router.get(
  "/order/:id/shop-orders",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
      }

      if (String(order.user) !== String(req.user._id)) {
        return next(
          new ErrorHandler("You are not authorized to view this order.", 403)
        );
      }

      res.status(200).json({
        success: true,
        shopOrders: order.shopOrders || [],
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Failed to fetch shop orders.", 500));
    }
  })
);

/**
 * PUT /order/:id/status
 * Update order status (for admin/seller use)
 */
router.put(
  "/order/:id/status",
  isSellerAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const { orderStatus, paymentStatus } = req.body;

    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
      }

      if (String(order.shopId) !== String(req.seller._id)) {
        return next(
          new ErrorHandler("You are not authorized to update this order.", 403)
        );
      }

      const previousStatus = order.orderStatus;
      const newStatus = orderStatus || previousStatus;

      console.log(`🔄 Updating order ${req.params.id}: ${previousStatus} → ${newStatus}`);

      // Update order status
      order.orderStatus = newStatus;
      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }

      // If status changed to "delivered", update product inventory
      if (previousStatus !== "delivered" && newStatus === "delivered") {
        for (const item of order.cart) {
          if (item.id || item._id) {
            const product = await Product.findById(item.id || item._id);
            if (product) {
              // Decrease stock and increase sold_out count
              product.stock = Math.max(0, product.stock - (item.qty || 1));
              product.sold_out = (product.sold_out || 0) + (item.qty || 1);
              await product.save();
            }
          }
        }
      }

      await order.save();

      const io = req.app.get("io");
      if (io) {
        console.log(`📡 Emitting orderUpdated event for order ${req.params.id}`);
        io.emit("orderUpdated", order);
      } else {
        console.log("⚠️ Socket.IO not available");
      }

      res.status(200).json({
        success: true,
        message: "Order status updated.",
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Failed to update order.", 500));
    }
  })
);

/**
 * POST /order/:id/message
 * Send message from seller to customer
 */
router.post(
  "/order/:id/message",
  isSellerAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const { userId, message } = req.body;

    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
      }

      if (String(order.shopId) !== String(req.seller._id)) {
        return next(
          new ErrorHandler("You are not authorized to message for this order.", 403)
        );
      }

      // Here you would typically send the message via email or notification system
      // For now, we'll just return success
      // You can integrate with your email service here

      res.status(200).json({
        success: true,
        message: "Message sent successfully.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Failed to send message.", 500));
    }
  })
);
router.put(
  "/order/:id/shop-order/:shopOrderId/status",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const { status, shippedAt, deliveredAt } = req.body;

    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
      }

      const shopOrder = order.shopOrders.id(req.params.shopOrderId);

      if (!shopOrder) {
        return next(new ErrorHandler("Shop order not found.", 404));
      }

      // Update shop order status
      if (status) shopOrder.status = status;
      if (shippedAt) shopOrder.shippedAt = shippedAt;
      if (deliveredAt) shopOrder.deliveredAt = deliveredAt;

      // Update main order status if all shop orders are delivered
      const allDelivered = order.shopOrders.every(
        (so) => so.status === "delivered"
      );
      if (allDelivered) {
        order.orderStatus = "delivered";
        order.deliveredAt = new Date();
      }

      await order.save();

      res.status(200).json({
        success: true,
        message: "Shop order status updated.",
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Failed to update shop order.", 500));
    }
  })
);


/**
 * POST /order/:id/request-refund
 * Request a refund for a delivered order
 */
router.post(
  "/order/:id/request-refund",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const { reason } = req.body;

    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
      }

      // Authorization: only user who placed order can request refund
      if (String(order.user) !== String(req.user._id)) {
        return next(
          new ErrorHandler("You are not authorized to request refund for this order.", 403)
        );
      }

      // Check if order is delivered (refunds only for delivered orders)
      if (order.orderStatus !== "delivered") {
        return next(
          new ErrorHandler("Refunds can only be requested for delivered orders.", 400)
        );
      }

      // Check if refund already requested
      if (order.refund?.requested) {
        return next(
          new ErrorHandler("Refund has already been requested for this order.", 400)
        );
      }

      if (!reason || !reason.trim()) {
        return next(new ErrorHandler("Refund reason is required.", 400));
      }

      // Set refund information
      order.refund = {
        requested: true,
        status: "pending",
        reason: reason.trim(),
        requestedAt: new Date(),
        processedAt: null,
        refundAmount: order.totalPrice,
        notes: ""
      };

      await order.save();

      // Emit real-time event for new refund request
      const io = req.app.get("io");
      if (io) {
        io.emit("refundRequested", { orderId: order._id, refund: order.refund });
        io.emit("orderUpdated", order);
      }

      res.status(200).json({
        success: true,
        message: "Refund requested successfully.",
        refund: order.refund,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Failed to request refund.", 500));
    }
  })
);

/**
 * GET /order/:id/refund-status
 * Get refund status for an order
 */
router.get(
  "/order/:id/refund-status",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
      }

      // Authorization: only user who placed order can view refund status
      if (String(order.user) !== String(req.user._id)) {
        return next(
          new ErrorHandler("You are not authorized to view refund status for this order.", 403)
        );
      }

      res.status(200).json({
        success: true,
        refund: order.refund,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Failed to fetch refund status.", 500));
    }
  })
);

/**
 * PUT /order/:id/refund-status (for sellers/admin)
 * Update refund status
 */
router.put(
  "/order/:id/refund-status",
  isSellerAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const { status, notes } = req.body;

    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
      }

      // Authorization: only seller who owns the order can update refund
      if (String(order.shopId) !== String(req.seller._id)) {
        return next(
          new ErrorHandler("You are not authorized to update refund for this order.", 403)
        );
      }

      if (!order.refund?.requested) {
        return next(new ErrorHandler("No refund requested for this order.", 400));
      }

      const validStatuses = ["pending", "processing", "approved", "rejected", "refunded"];
      if (status && !validStatuses.includes(status)) {
        return next(new ErrorHandler("Invalid refund status.", 400));
      }

      if (status) {
        order.refund.status = status;
      }
      if (notes) {
        order.refund.notes = notes;
      }
      if (status === "refunded" || status === "approved") {
        order.refund.processedAt = new Date();
      }

      await order.save();

      // Emit real-time event for refund update
      const io = req.app.get("io");
      if (io) {
        io.emit("refundUpdated", { orderId: order._id, refund: order.refund });
        io.emit("orderUpdated", order);
      }

      res.status(200).json({
        success: true,
        message: "Refund status updated.",
        refund: order.refund,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message || "Failed to update refund status.", 500));
    }
  })
);


module.exports = router;
