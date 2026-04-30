import React, { useEffect, useState } from "react";
import { formatSellerCurrency } from "../sellerSession";
import SellerOrderDetailModal from "./SellerOrderDetailModal";

const statusStyles = {
  pending: "border border-amber-300/30 bg-amber-300/10 text-amber-200",
  processing: "border border-sky-300/30 bg-sky-300/10 text-sky-200",
  shipped: "border border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  delivered: "border border-white/15 bg-white/5 text-white/70",
  cancelled: "border border-rose-300/30 bg-rose-300/10 text-rose-200",
};

const formatOrderId = (orderId = "") =>
  `ORD-${String(orderId || "").slice(-8).toUpperCase()}`;

const formatStatusLabel = (value = "") =>
  String(value || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatPaymentMethodLabel = (value = "") => {
  const normalizedValue = String(value || "").trim().toLowerCase();

  if (normalizedValue === "cod") {
    return "Cash on Delivery";
  }

  if (normalizedValue === "card") {
    return "Card";
  }

  if (normalizedValue === "paypal") {
    return "PayPal";
  }

  return formatStatusLabel(normalizedValue || "card");
};

const formatPlacedAt = (value) => {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getItemPreview = (cart = []) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    return "No items in this order yet.";
  }

  const preview = cart
    .slice(0, 2)
    .map((item) => `${item?.name || "Item"} x${Number(item?.qty || 1)}`)
    .join(", ");

  if (cart.length <= 2) {
    return preview;
  }

  return `${preview}, +${cart.length - 2} more`;
};

const SellerDashboardOrdersPanel = ({
  recentOrders = [],
  isLoading = false,
  error = "",
  onStatusChange = () => {},
  onSendMessage = () => {},
  isUpdating = false,
  isSendingMessage = false,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);


  useEffect(() => {
    if (!selectedOrder) return;

    const updatedOrder = recentOrders.find(
      (order) => order._id === selectedOrder._id
    );

    if (updatedOrder && updatedOrder !== selectedOrder) {
      console.log("✏️ Updating selected order status:", updatedOrder.orderStatus);
      setSelectedOrder(updatedOrder);
    }
  }, [recentOrders, selectedOrder]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:p-7">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">All Orders</p>
        <h2 className="mt-3 text-2xl font-Playfair font-semibold text-white">
          Loading orders
        </h2>
        <p className="mt-3 text-sm text-white/50">
          Fetching the latest orders for this shop.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:p-7">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">All Orders</p>
        <h2 className="mt-3 text-2xl font-Playfair font-semibold text-white">
          Orders unavailable
        </h2>
        <p className="mt-3 text-sm text-rose-200">{error}</p>
      </div>
    );
  }

  if (!recentOrders.length) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:p-7">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">All Orders</p>
        <h2 className="mt-3 text-2xl font-Playfair font-semibold text-white">
          No orders yet
        </h2>
        <p className="mt-3 text-sm text-white/50">
          New shop orders will appear here as soon as customers place them.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:p-7">
        <div className="mb-5">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
            All Orders
          </p>
          <h2 className="mt-2 text-2xl font-Playfair font-semibold">
            Recent orders
          </h2>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <button
              key={order._id || order.id}
              onClick={() => handleOrderClick(order)}
              className="w-full text-left grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_1.3fr_0.75fr_0.95fr] hover:bg-white/[0.05] hover:border-white/20 transition"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  {order?.user?.name || "Customer"}
                </p>
                <p className="mt-1 text-xs text-white/35">
                  {formatOrderId(order?._id || order?.id)}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70">{getItemPreview(order?.cart)}</p>
                <p className="mt-1 text-xs text-white/35">
                  {formatPaymentMethodLabel(order?.paymentMethod)} • {order?.paymentStatus === "pending" && order?.paymentMethod === "cod"
                    ? "Payment on delivery"
                    : formatStatusLabel(order?.paymentStatus)}
                </p>
              </div>
              <p className="text-sm font-semibold text-white">
                {formatSellerCurrency(order?.totalPrice || order?.total || 0)}
              </p>
              <div className="flex items-center justify-between gap-3 md:justify-end" onClick={(e) => e.stopPropagation()}>
                <select
                  value={String(order?.orderStatus || order?.status || "pending").toLowerCase()}
                  disabled={isUpdating}
                  onChange={(e) => onStatusChange(order._id || order.id, e.target.value)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold bg-transparent outline-none cursor-pointer transition border ${
                    statusStyles[String(order?.orderStatus || order?.status || "pending").toLowerCase()] ||
                    statusStyles.pending
                  }`}
                >
                  <option value="pending" className="bg-[#111114] text-amber-200">Pending</option>
                  <option value="processing" className="bg-[#111114] text-sky-200">Processing</option>
                  <option value="shipped" className="bg-[#111114] text-emerald-200">Shipped</option>
                  <option value="delivered" className="bg-[#111114] text-white/70">Delivered</option>
                  <option value="cancelled" className="bg-[#111114] text-rose-200">Cancelled</option>
                </select>
                <span className="text-xs text-white/35">{formatPlacedAt(order?.createdAt)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Order Detail Modal */}
      <SellerOrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onStatusChange={onStatusChange}
        onSendMessage={onSendMessage}
        isUpdating={isUpdating}
        isSendingMessage={isSendingMessage}
      />
    </>
  );
};

export default SellerDashboardOrdersPanel;
