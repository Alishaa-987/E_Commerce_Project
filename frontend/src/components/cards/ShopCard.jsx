import React from "react";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiPackage, FiUsers } from "react-icons/fi";

const ShopCard = ({ shop }) => {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#111114] overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-[#18181b]">
        <img
          src={shop.banner}
          alt={shop.name}
          className="w-full h-full object-cover object-center opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111114]/45" />
      </div>

      {/* Avatar */}
      <div className="relative z-10 mt-3 px-5 flex items-center justify-between">
        <img
          src={shop.avatar}
          alt={shop.name}
          className="h-16 w-16 rounded-xl border-2 border-[#111114] bg-[#18181b] p-1 object-contain ring-1 ring-white/20"
        />
        <Link
          to={`/shop/${shop.handle}`}
          className="mb-1 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white/70 hover:border-white/50 hover:text-white transition"
        >
          Visit
        </Link>
      </div>

      {/* Info */}
      <div className="px-5 pb-5 pt-4">
        <h3 className="font-semibold text-base text-white mb-0.5">{shop.name}</h3>
        <p className="text-sm text-white/40 line-clamp-2 mb-3">
          {shop.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-white/50">
          <span className="flex items-center gap-1">
            <AiFillStar size={11} className="text-emerald-300" />
            {shop.rating}
          </span>
          <span className="flex items-center gap-1">
            <FiPackage size={11} />
            {shop.products} products
          </span>
          <span className="flex items-center gap-1">
            <FiUsers size={11} />
            {shop.followers.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;


