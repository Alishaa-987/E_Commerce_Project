import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { deriveCategories } from "../../utils/marketplace";

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
  const { allProducts, allProductsLoading } = useSelector((state) => state.products);
  const categories = deriveCategories(allProducts).slice(0, 8);

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
            View all -
          </Link>
        </div>

        {allProductsLoading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111114] px-6 py-12 text-center text-sm text-white/45">
            Loading categories...
          </div>
        ) : categories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((cat) => {
              const Icon = iconMap[cat.name] || FiGift;
              const color =
                colorMap[cat.name] || "text-white/60 bg-white/5 border-white/10";
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#111114] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium leading-tight text-white">
                      {cat.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/30">
                      {cat.count} products
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#111114] px-6 py-12 text-center">
            <p className="text-lg font-semibold text-white">No categories yet</p>
            <p className="mt-2 text-sm text-white/45">
              Categories will appear automatically when backend products are added.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
