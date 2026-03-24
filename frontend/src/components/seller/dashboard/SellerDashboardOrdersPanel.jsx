import React from "react";
import { formatSellerCurrency } from "../sellerSession";

const statusStyles = {
  Processing: "border border-amber-300/30 bg-amber-300/10 text-amber-200",
  Packed: "border border-sky-300/30 bg-sky-300/10 text-sky-200",
  Shipped: "border border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Delivered: "border border-white/15 bg-white/5 text-white/70",
};

const SellerDashboardOrdersPanel = ({ recentOrders }) => {
  return (
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
          <div
            key={order.id}
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_1.2fr_0.7fr_0.8fr]"
          >
            <div>
              <p className="text-sm font-semibold text-white">{order.customer}</p>
              <p className="mt-1 text-xs text-white/35">{order.id}</p>
            </div>
            <p className="text-sm text-white/70">{order.item}</p>
            <p className="text-sm font-semibold text-white">
              {formatSellerCurrency(order.total)}
            </p>
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  statusStyles[order.status] || statusStyles.Processing
                }`}
              >
                {order.status}
              </span>
              <span className="text-xs text-white/35">{order.placedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboardOrdersPanel;
