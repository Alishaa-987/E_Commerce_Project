import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import CountdownTimer from "../CountdownTimer";
import { flashSaleProduct, flashSaleEndDate } from "../../data/mockData";
import { useCart } from "../../context/CartContext";

const Events = () => {
  const { addToCart } = useCart();
  const product = flashSaleProduct;
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <section className="py-16 bg-[#0b0b0d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-[#111114]">
          {/* Background glow */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-300/5 blur-[100px]" />

          <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            {/* Left: Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-emerald-300">
                  Flash sale · Live now
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-Playfair font-semibold text-white leading-tight">
                  Up to{" "}
                  <span className="text-emerald-300">{discount}% off</span>{" "}
                  on premium picks
                </h2>
                <p className="mt-3 text-sm text-white/50">
                  Limited stock. Don't miss your chance to grab these at their lowest price — ever.
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
                  Sale ends in
                </p>
                <CountdownTimer endDate={flashSaleEndDate} />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-300 px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
                >
                  Add to Cart · ${product.price}
                </button>
                <Link
                  to="/products"
                  className="flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/70 hover:border-white/40 hover:text-white transition"
                >
                  View all deals <FiArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: Product showcase */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-4 rounded-3xl border border-emerald-300/10 bg-emerald-300/5" />
                <div className="relative w-64 sm:w-72 rounded-2xl border border-white/10 bg-[#0b0b0d] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
                  {/* Price tag */}
                  <div className="absolute top-3 right-3 rounded-xl bg-emerald-300 px-3 py-1.5 text-center">
                    <p className="text-[9px] font-bold uppercase text-[#0b0b0d]">
                      -{discount}%
                    </p>
                  </div>
                </div>

                {/* Info card */}
                <div className="mt-3 rounded-2xl border border-white/10 bg-[#111114] p-4">
                  <p className="text-xs text-white/40 mb-1">{product.shopName}</p>
                  <p className="text-sm font-semibold text-white mb-2">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-white">
                        ${product.price}
                      </span>
                      <span className="text-sm text-white/30 line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <AiFillStar size={12} className="text-emerald-300" />
                      {product.rating} · {product.reviews} reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
