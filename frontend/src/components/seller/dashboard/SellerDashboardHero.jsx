import React from "react";
import { FiBarChart2, FiStar, FiUsers } from "react-icons/fi";

const SellerDashboardHero = ({
  sellerShop,
  sellerAvatar,
  averageRating,
  sellerProductCount,
}) => {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111114] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <img
          src={sellerShop.banner}
          alt={sellerShop.name}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%),linear-gradient(135deg,rgba(11,11,13,0.35),rgba(11,11,13,0.92))]" />
        <div className="relative flex h-full flex-col justify-between p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={sellerAvatar}
                alt={sellerShop.name}
                className="h-16 w-16 rounded-[22px] border border-white/15 object-cover shadow-lg"
              />
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-white/45">
                  Store Profile
                </p>
                <h2 className="mt-2 text-3xl font-Playfair font-semibold text-white">
                  {sellerShop.name}
                </h2>
              </div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70 backdrop-blur">
              Active seller
            </div>
          </div>

          <div className="mt-8 max-w-2xl">
            <p className="text-sm leading-7 text-white/65">
              {sellerShop.description}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#0b0b0d]/35 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-white/45">
                <FiStar size={14} className="text-emerald-300" />
                Rating
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {averageRating}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0b0b0d]/35 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-white/45">
                <FiUsers size={14} className="text-emerald-300" />
                Followers
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {sellerShop.followers.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0b0b0d]/35 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm text-white/45">
                <FiBarChart2 size={14} className="text-emerald-300" />
                Live products
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {sellerProductCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerDashboardHero;
