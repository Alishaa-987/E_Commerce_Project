import React from "react";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiPackage, FiUsers } from "react-icons/fi";

const ShopCard = ({ shop }) => {
  const handleLabel = shop.handle ? `@${shop.handle}` : "Seller storefront";

  return (
    <div className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#111114] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
      <div className="relative h-52 w-full overflow-hidden bg-[#18181b]">
        <img
          src={shop.banner}
          alt={shop.name}
          className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-35 blur-2xl"
        />
        <img
          src={shop.banner}
          alt={shop.name}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,13,0.12),rgba(11,11,13,0.25)_40%,rgba(11,11,13,0.9)_100%)]" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 backdrop-blur">
            Featured Shop
          </span>
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur">
            {shop.products} Products
          </span>
        </div>

        <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={shop.avatar}
              alt={shop.name}
              className="h-16 w-16 rounded-[22px] border border-white/15 bg-[#111114]/80 p-1.5 object-contain shadow-lg backdrop-blur"
            />
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-white">{shop.name}</h3>
              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.22em] text-white/45">
                {handleLabel}
              </p>
            </div>
          </div>

          <Link
            to={`/shop/${shop.handle}`}
            className="shrink-0 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b0b0d] transition hover:-translate-y-0.5"
          >
            Visit
          </Link>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <p className="line-clamp-2 text-sm leading-6 text-white/50">{shop.description}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-white/65">
            <AiFillStar size={11} className="text-emerald-300" />
            {shop.rating}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-white/65">
            <FiPackage size={11} />
            {shop.products} products
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-white/65">
            <FiUsers size={11} />
            {shop.followers.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;


