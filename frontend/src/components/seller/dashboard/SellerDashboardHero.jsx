import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiClock, FiMapPin, FiPackage, FiStar } from "react-icons/fi";
import { getSellerNavPath } from "../sellerWorkspace";

const SellerDashboardHero = ({
  sellerShop,
  sellerAvatar,
  averageRating,
  sellerProductCount,
  runningEventCount,
  shopMeta,
}) => {
  const avatarLabel = sellerShop?.name?.trim()?.charAt(0)?.toUpperCase() || "S";

  const highlights = [
    {
      label: "Active products",
      value: sellerProductCount,
      icon: FiPackage,
    },
    {
      label: "Running events",
      value: runningEventCount,
      icon: FiClock,
    },
    {
      label: "Average rating",
      value: averageRating,
      icon: FiStar,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111114] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
      <img
        src={sellerShop.banner}
        alt={sellerShop.name}
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_34%),linear-gradient(135deg,rgba(11,11,13,0.2),rgba(11,11,13,0.92))]" />
      <div className="relative grid gap-8 p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
        <div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/65 backdrop-blur">
            Seller Dashboard
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {sellerAvatar ? (
              <img
                src={sellerAvatar}
                alt={sellerShop.name}
                className="h-16 w-16 rounded-[22px] border border-white/15 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/15 bg-emerald-300/15 text-xl font-semibold text-emerald-200">
                {avatarLabel}
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                @{sellerShop.handle}
              </p>
              <h2 className="mt-2 text-3xl font-Playfair font-semibold text-white lg:text-4xl">
                {sellerShop.name}
              </h2>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">
            {sellerShop.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
              <FiMapPin size={13} className="text-emerald-300" />
              <span>{shopMeta?.address || "No address added yet."}</span>
            </div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
              Joined {shopMeta?.joinedOn || "Recently joined"}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to={`/shop/${sellerShop.handle}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b0b0d] transition hover:-translate-y-0.5"
            >
              View Shop
              <FiArrowRight size={14} />
            </Link>
            <Link
              to={getSellerNavPath("createProduct")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:border-white/20 hover:text-white"
            >
              Create Product
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#0b0b0d]/45 p-5 backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
            At A Glance
          </p>
          <div className="mt-5 space-y-3">
            {highlights.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300">
                    <Icon size={15} />
                  </div>
                  <span className="text-sm text-white/60">{label}</span>
                </div>
                <span className="text-lg font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/55">
            Use the left menu for products, events, discounts, and settings.
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerDashboardHero;
