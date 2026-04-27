/**
 * Group cart items by shop
 * @param {Array} cartItems - Array of cart items with shopId/shop info
 * @returns {Object} - Items grouped by shop
 */
export const groupItemsByShop = (cartItems = []) => {
  const grouped = {};

  cartItems.forEach((item) => {
    const shopId = item.shopId || item.shop?._id || "unknown-shop";
    const shopName = item.shopName || item.shop?.name || "Unknown Shop";

    if (!grouped[shopId]) {
      grouped[shopId] = {
        shopId,
        shopName,
        items: [],
        subTotal: 0,
      };
    }

    grouped[shopId].items.push(item);
    grouped[shopId].subTotal += (item.price || 0) * (item.qty || 1);
  });

  return Object.values(grouped);
};

/**
 * Calculate order totals
 * @param {Array} cartItems - Cart items
 * @param {number} shippingCost - Shipping cost
 * @returns {Object} - Totals breakdown
 */
export const calculateOrderTotals = (cartItems = [], shippingCost = 0) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const tax = 0; // Can be calculated based on location/items
  const total = subtotal + tax + shippingCost;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shippingCost.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

/**
 * Format order status for display
 * @param {string} status - Order status
 * @returns {Object} - Formatted status with styling info
 */
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: {
      label: "Pending",
      color: "text-yellow-200",
      bgColor: "bg-yellow-300/20",
      icon: "⏳",
    },
    processing: {
      label: "Processing",
      color: "text-blue-200",
      bgColor: "bg-blue-300/20",
      icon: "⚙️",
    },
    shipped: {
      label: "Shipped",
      color: "text-purple-200",
      bgColor: "bg-purple-300/20",
      icon: "📦",
    },
    delivered: {
      label: "Delivered",
      color: "text-emerald-200",
      bgColor: "bg-emerald-300/20",
      icon: "✓",
    },
    cancelled: {
      label: "Cancelled",
      color: "text-red-200",
      bgColor: "bg-red-300/20",
      icon: "✗",
    },
  };

  return statusMap[status] || statusMap.pending;
};

/**
 * Check if order has multiple shops
 * @param {Array} shopOrders - Shop orders array
 * @returns {boolean}
 */
export const isMultiShopOrder = (shopOrders = []) => {
  return Array.isArray(shopOrders) && shopOrders.length > 1;
};

/**
 * Get overall order progress
 * @param {Array} shopOrders - Shop orders array
 * @returns {Object} - Progress information
 */
export const getOrderProgress = (shopOrders = []) => {
  if (!Array.isArray(shopOrders) || shopOrders.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const completed = shopOrders.filter((so) => so.status === "delivered").length;
  const total = shopOrders.length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export const formatOrderDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
