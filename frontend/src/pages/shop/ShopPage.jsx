import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiPackage, FiUsers } from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/cards/ProductCard";
import { shops, products } from "../../data/mockData";

const ShopPage = () => {
  const { handle } = useParams();
  const shop = shops.find((s) => s.handle === handle);
  const [followed, setFollowed] = useState(false);

  if (!shop) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-xl font-Playfair mb-4">Shop not found</p>
          <Link to="/" className="text-emerald-300 text-sm hover:text-white transition">
            &larr; Go home
          </Link>
        </div>
      </div>
    );
  }

  const shopProducts = products.filter((p) => p.shopId === shop.id);
  const allProducts = shopProducts.length > 0 ? shopProducts : products.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />

      {/* Banner */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden mt-16">
        <img
          src={shop.banner}
          alt={shop.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b0d]/40 to-[#0b0b0d]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Shop info card */}
        <div className="-mt-12 relative z-10 rounded-2xl border border-white/10 bg-[#111114] p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={shop.avatar}
              alt={shop.name}
              className="h-16 w-16 rounded-2xl border-2 border-white/10 object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-Playfair font-semibold text-white mb-1">
                {shop.name}
              </h1>
              <p className="text-sm text-white/50 mb-3">{shop.description}</p>
              <div className="flex flex-wrap items-center gap-5 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <AiFillStar size={14} className="text-emerald-300" />
                  <span className="text-white">{shop.rating}</span> rating
                </span>
                <span className="flex items-center gap-1.5">
                  <FiPackage size={14} />
                  {shop.products} products
                </span>
                <span className="flex items-center gap-1.5">
                  <FiUsers size={14} />
                  {shop.followers.toLocaleString()} followers
                </span>
              </div>
            </div>
            <button
              onClick={() => setFollowed((f) => !f)}
              className={`shrink-0 rounded-xl px-6 py-2.5 text-sm font-semibold transition ${
                followed
                  ? "border border-emerald-300/30 bg-emerald-300/10 text-emerald-300"
                  : "bg-white text-[#0b0b0d] hover:-translate-y-0.5"
              }`}
            >
              {followed ? "Following" : "Follow Shop"}
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
            Products | {allProducts.length}
          </p>
          <h2 className="text-2xl font-Playfair font-semibold text-white">
            From {shop.name}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {allProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
