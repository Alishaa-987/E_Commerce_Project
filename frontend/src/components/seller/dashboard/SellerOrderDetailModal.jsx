import React, { useEffect, useState } from "react";
import { FiX, FiSend, FiCheck } from "react-icons/fi";

const ORDER_STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered"];

const statusStyles = {
  pending: "bg-amber-300/20 text-amber-200 border border-amber-300/30",
  processing: "bg-sky-300/20 text-sky-200 border border-sky-300/30",
  shipped: "bg-emerald-300/20 text-emerald-200 border border-emerald-300/30",
  delivered: "bg-white/10 text-white border border-white/20",
  cancelled: "bg-rose-300/20 text-rose-200 border border-rose-300/30",
};

const formatStatusLabel = (value = "") =>
  String(value || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatCurrency = (value = 0) => `USD $${Number(value || 0).toFixed(2)}`;

const SellerOrderDetailModal = ({
  order = null,
  isOpen = false,
  onClose = () => {},
  onStatusChange = () => {},
  onSendMessage = () => {},
  isUpdating = false,
  isSendingMessage = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "pending");
  const [messageText, setMessageText] = useState("");
  const [statusChangeSuccess, setStatusChangeSuccess] = useState(false);
  const [messageSendSuccess, setMessageSendSuccess] = useState(false);

  useEffect(() => {
    setSelectedStatus(order?.orderStatus || "pending");
  }, [order]);

  if (!isOpen || !order) {
    return null;
  }

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.orderStatus) return;

    console.log("🔄 Changing order status from", order.orderStatus, "to", selectedStatus);
    setStatusChangeSuccess(false);
    const result = await onStatusChange(order._id, selectedStatus);

    console.log("✅ Status update result:", result);
    if (result?.success) {
      setStatusChangeSuccess(true);
      // Immediately show the new status in the modal
      setSelectedStatus(selectedStatus);
      setTimeout(() => setStatusChangeSuccess(false), 3000);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setMessageSendSuccess(false);
    const result = await onSendMessage(order._id, order.user._id, messageText);

    if (result?.success) {
      setMessageText("");
      setMessageSendSuccess(true);
      setTimeout(() => setMessageSendSuccess(false), 3000);
    }
  };

  const cartItems = Array.isArray(order.cart) ? order.cart : [];
  const shippingAddress = order.shippingAddress || {};
  const totalPrice = order.totalPrice || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#111114] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-white/10 bg-[#111114] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-Playfair font-semibold text-white">
              Order Details
            </h2>
            <p className="mt-1 text-sm text-white/50">
              ORD-{String(order._id).slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10 transition"
          >
            <FiX className="text-white" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">
              Customer
            </h3>
            <p className="mt-3 text-lg font-semibold text-white">
              {order.user?.name || "Customer"}
            </p>
            <p className="mt-1 text-sm text-white/50">{order.user?.email || ""}</p>
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">
              Delivery Address
            </h3>
            <div className="mt-3 space-y-1 text-sm text-white/70">
              <p>{shippingAddress.addressLine1 || ""}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country || ""}</p>
              <p className="mt-2 font-semibold text-white">
                Phone: {shippingAddress.phone || ""}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">
              Products
            </h3>
            <div className="mt-4 space-y-3">
              {cartItems.length > 0 ? (
                cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between border-b border-white/10 pb-3 last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.name || "Item"}</p>
                      <p className="mt-1 text-xs text-white/50">
                        Qty: {item.qty || 1} × {formatCurrency(item.price || 0)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency((item.price || 0) * (item.qty || 1))}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-white/50">No items in this order.</p>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subTotal || 0)}</span>
              </div>
              {order.adjustmentAmount !== 0 && (
                <div className="flex justify-between text-sm text-white/70">
                  <span>Adjustment</span>
                  <span>{formatCurrency(order.adjustmentAmount || 0)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-2">
                <div className="flex justify-between font-semibold text-white">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-white/50">Payment Method:</span>
                <span className="text-sm font-semibold text-white">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : order.paymentMethod === "card"
                    ? "Card"
                    : "PayPal"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/50">Payment Status:</span>
                <span className="text-sm font-semibold text-white">
                  {order.paymentStatus === "pending" && order.paymentMethod === "cod"
                    ? "Pay on Delivery"
                    : formatStatusLabel(order.paymentStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">
              Order Status
            </h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                      selectedStatus === status
                        ? `${statusStyles[status]}`
                        : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {formatStatusLabel(status)}
                  </button>
                ))}
              </div>
              {selectedStatus !== order.orderStatus && (
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="w-full rounded-lg bg-emerald-500/20 px-4 py-3 font-semibold text-emerald-200 border border-emerald-300/30 hover:bg-emerald-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiCheck size={18} />
                  {isUpdating ? "Updating..." : "Update Status"}
                </button>
              )}
              {statusChangeSuccess && (
                <p className="text-sm text-emerald-200">Status updated successfully!</p>
              )}
            </div>
          </div>

          {/* Messaging */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">
              Send Message to Customer
            </h3>
            <div className="space-y-3">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition resize-none h-24"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || isSendingMessage}
                className="w-full rounded-lg bg-blue-500/20 px-4 py-3 font-semibold text-blue-200 border border-blue-300/30 hover:bg-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FiSend size={18} />
                {isSendingMessage ? "Sending..." : "Send Message"}
              </button>
              {messageSendSuccess && (
                <p className="text-sm text-blue-200">Message sent to customer!</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-[#111114] p-6">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/20 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetailModal;
