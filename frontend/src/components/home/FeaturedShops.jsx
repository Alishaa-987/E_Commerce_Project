import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ShopCard from "../ShopCard";
import { shops } from "../../data/mockData";

const FeaturedShops = () => {
  return (
    <section className="py-16 bg-[#0b0b0d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
              Our sellers
            </p>
            <h2 className="text-2xl font-Playfair font-semibold text-white">
              Featured Shops
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:text-white hover:border-white/30 transition"
          >
            All shops <FiArrowRight size={12} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.slice(0, 6).map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedShops;
