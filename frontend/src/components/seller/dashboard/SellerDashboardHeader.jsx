import React from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { sellerNavItems } from "../sellerWorkspace";

const SellerDashboardHeader = ({
  sellerShop,
  sellerAvatar,
  activeSection,
  onLogout,
}) => {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b0d]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">
              Seller Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-Playfair font-semibold text-white">
              Welcome back, {sellerShop.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/shop/${sellerShop.handle}`}
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/25 hover:text-white sm:inline-flex"
            >
              View Shop
            </Link>
            <Link
              to="/seller/profile"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-white/25"
              aria-label="Open seller profile"
            >
              <img
                src={sellerAvatar}
                alt={sellerShop.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            </Link>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0b0d] transition hover:-translate-y-0.5"
            >
              <FiLogOut size={14} />
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 pt-5 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sellerNavItems.map(({ key, label, icon: Icon, path }) => (
            <Link
              key={key}
              to={path}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition ${
                activeSection === key
                  ? "border border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                  : "border border-white/10 bg-white/5 text-white/60"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SellerDashboardHeader;
