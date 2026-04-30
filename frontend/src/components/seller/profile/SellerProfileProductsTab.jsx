import React from "react";
import ProductCard from "../../cards/ProductCard";

const SellerProfileProductsTab = ({
  sellerProducts,
  sellerProductCount,
  averageRating,
  sellerShop,
}) => {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[26px] border border-white/10 bg-[#111114] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Total Products</p>
          <p className="mt-4 text-3xl font-semibold text-white">{sellerProductCount}</p>
          <p className="mt-2 text-sm text-white/45">Live items in your storefront</p>
        </div>
        <div className="rounded-[26px] border border-white/10 bg-[#111114] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Shop Rating</p>
          <p className="mt-4 text-3xl font-semibold text-white">{averageRating}</p>
          <p className="mt-2 text-sm text-white/45">Current visible storefront rating</p>
        </div>
        <div className="rounded-[26px] border border-white/10 bg-[#111114] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Followers</p>
          <p className="mt-4 text-3xl font-semibold text-white">
            {sellerShop.followers.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-white/45">Audience following the shop</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {sellerProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SellerProfileProductsTab;
