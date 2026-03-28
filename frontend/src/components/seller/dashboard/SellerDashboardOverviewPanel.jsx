import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiClock,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiPlusSquare,
  FiSettings,
  FiStar,
  FiTag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { getSellerNavPath } from "../sellerWorkspace";

const overviewIconMap = {
  revenue: FiTrendingUp,
  orders: FiPackage,
  followers: FiUsers,
  rating: FiStar,
};

const SellerDashboardOverviewPanel = ({
  overviewCards,
  runningEvents,
  sellerShop,
  shopMeta,
}) => {
  const quickActions = [
    {
      label: "Create Product",
      hint: "Add a new listing to your shop",
      key: "createProduct",
      icon: FiPlusSquare,
    },
    {
      label: "Create Event",
      hint: "Launch a timed campaign",
      key: "createEvent",
      icon: FiClock,
    },
    {
      label: "Discount Codes",
      hint: "Manage coupon offers",
      key: "discountCodes",
      icon: FiTag,
    },
  ];

  const storeDetails = [
    {
      label: "Email",
      value: sellerShop?.email || "No email added yet.",
      icon: FiMail,
    },
    {
      label: "Phone",
      value: shopMeta?.phone || "No phone added yet.",
      icon: FiPhone,
    },
    {
      label: "Address",
      value: shopMeta?.address || "No address added yet.",
      icon: FiMapPin,
    },
    {
      label: "Joined",
      value: shopMeta?.joinedOn || "Recently joined",
      icon: FiStar,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-white/10 bg-[#111114] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
              Store Summary
            </p>
            <h2 className="mt-2 text-2xl font-Playfair font-semibold text-white">
              Clear performance snapshot
            </h2>
          </div>
          <Link
            to={getSellerNavPath("allProducts")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/20 hover:text-white"
          >
            Open Products
            <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map(({ label, value, detail, metricKey }) => {
            const Icon = overviewIconMap[metricKey];

            return (
              <div
                key={label}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
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
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.1fr_0.95fr]">
        <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                Quick Actions
              </p>
              <h2 className="mt-2 text-2xl font-Playfair font-semibold">
                What do you want to do?
              </h2>
            </div>
            <Link
              to={getSellerNavPath("settings")}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/25 hover:text-white"
            >
              Settings
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {quickActions.map(({ label, hint, key, icon: Icon }) => (
              <Link
                key={key}
                to={getSellerNavPath(key)}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="mt-1 text-xs text-white/45">{hint}</p>
                  </div>
                </div>
                <FiArrowRight size={16} className="text-white/35" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                Live Events
              </p>
              <h2 className="mt-2 text-2xl font-Playfair font-semibold">
                Campaign overview
              </h2>
            </div>
            <Link
              to={getSellerNavPath("allEvents")}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/25 hover:text-white"
            >
              All Events
            </Link>
          </div>

          {runningEvents.length ? (
            <div className="mt-5 space-y-3">
              {runningEvents.slice(0, 4).map((event) => (
                <Link
                  key={event.id}
                  to={getSellerNavPath("allEvents")}
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{event.title}</p>
                      <p className="mt-1 text-xs text-white/45">{event.window}</p>
                    </div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                      {event.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="text-sm text-white/45">
                No events are running yet. Start one when you want a focused promotion.
              </p>
              <Link
                to={getSellerNavPath("createEvent")}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b0b0d] transition hover:-translate-y-0.5"
              >
                Create Event
                <FiArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                Shop Details
              </p>
              <h2 className="mt-2 text-2xl font-Playfair font-semibold">
                Important info
              </h2>
            </div>
            <Link
              to="/seller/profile"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/20 hover:text-white"
            >
              <FiSettings size={13} />
              Profile
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {storeDetails.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-white/70">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardOverviewPanel;
