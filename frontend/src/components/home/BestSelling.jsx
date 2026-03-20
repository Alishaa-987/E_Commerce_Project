import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ProductCard from "../cards/ProductCard";
import { products } from "../../data/mockData";

const BestSelling = () => {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const featured = products.slice(0, 4);
  const displayProducts = bestSellers.length >= 4 ? bestSellers : featured;

  return (
    <section className="py-16 bg-[#0b0b0d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
              Top picks
            </p>
            <h2 className="text-2xl font-Playfair font-semibold text-white">
              Best Selling Products
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:text-white hover:border-white/30 transition"
          >
            View all <FiArrowRight size={12} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            to="/products"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/60"
          >
            View all products <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSelling;
