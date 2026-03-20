import React from "react";
import { Link } from "react-router-dom";
import {
  FiMonitor,
  FiShoppingBag,
  FiStar,
  FiHome,
  FiClock,
  FiGift,
  FiUser,
  FiNavigation,
} from "react-icons/fi";
import { categories } from "../../data/mockData";

const iconMap = {
  Electronics: FiMonitor,
  Clothing: FiUser,
  Bags: FiShoppingBag,
  Beauty: FiStar,
  Shoes: FiNavigation,
  "Home & Living": FiHome,
  Watches: FiClock,
  Gifts: FiGift,
};

const colorMap = {
  Electronics: "text-emerald-300 bg-emerald-300/10 border-emerald-300/20",
  Clothing: "text-violet-300 bg-violet-300/10 border-violet-300/20",
  Bags: "text-pink-300 bg-pink-300/10 border-pink-300/20",
  Beauty: "text-amber-300 bg-amber-300/10 border-amber-300/20",
  Shoes: "text-sky-300 bg-sky-300/10 border-sky-300/20",
  "Home & Living": "text-teal-300 bg-teal-300/10 border-teal-300/20",
  Watches: "text-red-300 bg-red-300/10 border-red-300/20",
  Gifts: "text-purple-300 bg-purple-300/10 border-purple-300/20",
};

const Categories = () => {
  return (
    <section className="py-16 bg-[#0b0b0d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
              Browse by type
            </p>
            <h2 className="text-2xl font-Playfair font-semibold text-white">
              Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs text-white/50 hover:text-white transition"
          >
            View all ->
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.name] || FiGift;
            const color = colorMap[cat.name] || "text-white/60 bg-white/5 border-white/10";
            return (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#111114] p-4 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-white leading-tight">
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
