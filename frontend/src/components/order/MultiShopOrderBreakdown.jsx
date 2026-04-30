import React from "react";
import { FiMapPin, FiPackage, FiTruck } from "react-icons/fi";

const MultiShopOrderBreakdown = ({ shopOrders = [], shippingAddress }) => {
  if (!shopOrders || shopOrders.length === 0) {
    return null;
  }

  const isSingleShop = shopOrders.length === 1;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">
          {isSingleShop ? "Order Details" : "Orders by Shop"}
        </h3>
        <p className="text-xs text-white/50 mb-4">
          {isSingleShop
            ? "Your order will be shipped from one location."
            : `Your order has been split into ${shopOrders.length} shipments from different shops. Each will be tracked separately.`}
        </p>
      </div>

      <div className="space-y-3">
        {shopOrders.map((shopOrder, index) => (
          <div
            key={shopOrder.shopId || index}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            {/* Shop Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiPackage size={16} className="text-emerald-300" />
                <h4 className="text-sm font-medium text-white">
                  {shopOrder.shopName || "Shop"}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                    shopOrder.status === "delivered"
                      ? "bg-emerald-300/20 text-emerald-200"
                      : shopOrder.status === "shipped"
                      ? "bg-blue-300/20 text-blue-200"
                      : shopOrder.status === "processing"
                      ? "bg-yellow-300/20 text-yellow-200"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {shopOrder.status ? shopOrder.status.charAt(0).toUpperCase() + shopOrder.status.slice(1) : "Pending"}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="mb-3 space-y-2">
              {shopOrder.items && shopOrder.items.length > 0 ? (
                shopOrder.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-start gap-2 text-xs text-white/70"
                  >
                    <span className="flex-1 truncate">
                      {item.name || "Product"} × {item.qty || 1}
                    </span>
                    <span className="text-white/50">
                      ${((item.price || 0) * (item.qty || 1)).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/50">No items</p>
              )}
            </div>

            {/* Subtotal */}
            <div className="border-t border-white/10 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/50">Subtotal</span>
                <span className="text-white font-medium">
                  ${(shopOrder.subTotal || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-start gap-2">
                <FiMapPin size={14} className="text-white/40 mt-0.5" />
                <div className="text-xs text-white/50">
                  <p>Ships to:</p>
                  <p className="text-white/70 font-medium">
                    {shippingAddress?.firstName} {shippingAddress?.lastName}
                  </p>
                  <p>{shippingAddress?.address1}</p>
                  {shippingAddress?.address2 && <p>{shippingAddress.address2}</p>}
                  <p>
                    {shippingAddress?.city}, {shippingAddress?.country}{" "}
                    {shippingAddress?.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isSingleShop && (
        <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4">
          <div className="flex items-start gap-3">
            <FiTruck size={16} className="text-emerald-300 mt-0.5" />
            <div className="text-xs text-emerald-200">
              <p className="font-medium mb-1">Multi-Shop Order</p>
              <p>Each shop will process and ship their items separately. You'll receive tracking updates for each shipment.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiShopOrderBreakdown;
