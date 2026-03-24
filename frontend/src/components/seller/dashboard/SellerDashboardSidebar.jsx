import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { sellerNavItems } from "../sellerWorkspace";

const SellerDashboardSidebar = ({
  sellerShop,
  sellerAvatar,
  storedEmail,
  activeSection,
}) => {
  return (
    <aside className="hidden w-[270px] shrink-0 flex-col border-r border-white/10 bg-[#0f0f12]/85 backdrop-blur-xl lg:flex">
      <div className="border-b border-white/10 px-6 pb-5 pt-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="text-xl font-Playfair font-semibold text-white">
            Lumen Seller
          </span>
        </Link>
        <p className="mt-3 text-sm leading-6 text-white/45">
          A focused control room for your storefront, orders, and growth.
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {sellerNavItems.map(({ key, label, icon: Icon, path }) => (
          <Link
            key={key}
            to={path}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
              activeSection === key
                ? "border border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                : "border border-transparent text-white/55 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4">
        <Link
          to="/seller/profile"
          className="block rounded-[26px] border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20"
        >
          <div className="flex items-center gap-3">
            <img
              src={sellerAvatar}
              alt={sellerShop.name}
              className="h-12 w-12 rounded-2xl object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">{sellerShop.name}</p>
              <p className="text-xs text-white/40">{storedEmail}</p>
            </div>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-300">
            Open shop profile <FiArrowRight size={14} />
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default SellerDashboardSidebar;
