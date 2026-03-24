import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiPackage,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { formatSellerCurrency } from "../sellerSession";
import { getSellerNavPath } from "../sellerWorkspace";

const overviewIconMap = {
  revenue: FiTrendingUp,
  orders: FiPackage,
  followers: FiUsers,
  rating: FiStar,
};

const statusStyles = {
  Processing: "border border-amber-300/30 bg-amber-300/10 text-amber-200",
  Packed: "border border-sky-300/30 bg-sky-300/10 text-sky-200",
  Shipped: "border border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Delivered: "border border-white/15 bg-white/5 text-white/70",
};

const SellerDashboardOverviewPanel = ({
  overviewCards,
  recentOrders,
  runningEvents,
}) => {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map(({ label, value, detail, metricKey }) => {
          const Icon = overviewIconMap[metricKey];

          return (
            <div
              key={label}
              className="rounded-[26px] border border-white/10 bg-[#111114] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                  {label}
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300">
                  <Icon size={16} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
              <p className="mt-2 text-sm text-white/45">{detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
                Dashboard
              </p>
              <h2 className="mt-2 text-2xl font-Playfair font-semibold">
                Store activity
              </h2>
            </div>
            <Link
              to={getSellerNavPath("allOrders")}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/25 hover:text-white"
            >
              Open Queue
            </Link>
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

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
              Running Events
            </p>
            <h2 className="mt-2 text-2xl font-Playfair font-semibold">
              Campaign pulse
            </h2>
            <div className="mt-5 space-y-3">
              {runningEvents.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  to={getSellerNavPath("allEvents")}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-white/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{event.title}</p>
                    <span className="text-xs text-white/35">{event.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/50">{event.window}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
              Quick Actions
            </p>
            <h2 className="mt-2 text-2xl font-Playfair font-semibold">
              Seller tools
            </h2>
            <div className="mt-5 space-y-3">
              {[
                { label: "Create Product", key: "createProduct" },
                { label: "Shop Inbox", key: "shopInbox" },
                { label: "Withdraw Money", key: "withdrawMoney" },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={getSellerNavPath(action.key)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/65 transition hover:border-white/20 hover:text-white"
                >
                  <span>{action.label}</span>
                  <FiArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardOverviewPanel;
