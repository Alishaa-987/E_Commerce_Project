import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import ShopCard from "../cards/ShopCard";

const FeaturedShops = () => {
  const { allShops, allShopsLoading } = useSelector((state) => state.seller);
  const featuredShops = [...allShops]
    .sort((a, b) => {
      if (Number(b.products || 0) !== Number(a.products || 0)) {
        return Number(b.products || 0) - Number(a.products || 0);
      }

      if (Number(b.followers || 0) !== Number(a.followers || 0)) {
        return Number(b.followers || 0) - Number(a.followers || 0);
      }

      return Number(b.rating || 0) - Number(a.rating || 0);
    })
    .slice(0, 6);

  return (
    <section className="py-20 bg-[#0b0b0d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-2.5">
              Our sellers
            </p>
            <h2 className="text-3xl font-Playfair font-semibold text-white">
              Featured Shops
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:border-white/30 transition"
          >
            All shops <FiArrowRight size={14} />
          </Link>
        </div>

        {allShopsLoading ? (
          <div className="rounded-3xl border border-white/10 bg-[#111114] px-8 py-16 text-center text-base text-white/45">
            Loading shops...
          </div>
        ) : featuredShops.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#111114] px-8 py-16 text-center">
            <p className="text-xl font-semibold text-white">No shops live yet</p>
            <p className="mt-3 text-base text-white/45">
              Seller storefronts from the backend will appear here as soon as they are created.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedShops;
