import React from "react";
import { formatSellerCurrency } from "../sellerSession";

const SellerDashboardProductsPanel = ({ sellerProducts }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {sellerProducts.map((product) => (
        <div
          key={product.id}
          className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111114] shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
        >
          <div className="relative h-52 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
            <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#0b0b0d]/80 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/65 backdrop-blur">
              {product.isBestSeller
                ? "Best Seller"
                : product.isNew
                  ? "New Drop"
                  : "Featured"}
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-white">{product.name}</p>
                <p className="mt-1 text-sm text-white/45">{product.category}</p>
              </div>
              <p className="text-lg font-semibold text-white">
                {formatSellerCurrency(product.price)}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-white/45">
              <span>{product.sold} sold</span>
              <span>{product.reviews} reviews</span>
              <span>{product.rating} rating</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerDashboardProductsPanel;
