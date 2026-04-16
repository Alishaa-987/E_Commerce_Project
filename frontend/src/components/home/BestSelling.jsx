import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import ProductCard from "../cards/ProductCard";

const BestSelling = () => {
  const { allProducts, allProductsLoading } = useSelector((state) => state.products);
  const bestSellers = [...allProducts]
    .sort((a, b) => Number(b.sold || 0) - Number(a.sold || 0))
    .slice(0, 4);
  const featured = allProducts.slice(0, 4);
  const displayProducts = bestSellers.length >= 4 ? bestSellers : featured;

  return (
    <section className="py-20 bg-[#0b0b0d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-2.5">
              Top picks
            </p>
            <h2 className="text-3xl font-Playfair font-semibold text-white">
              Best Selling Products
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:border-white/30 transition"
          >
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        {allProductsLoading ? (
          <div className="py-12 text-center text-base text-white/45">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            to="/products"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-white/60"
          >
            View all products <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSelling;
