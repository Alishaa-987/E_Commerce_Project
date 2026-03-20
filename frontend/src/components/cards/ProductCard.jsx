import React from "react";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const liked = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-[#111114] overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discount && (
          <span className="rounded-lg bg-emerald-300 px-2 py-0.5 text-[10px] font-bold uppercase text-[#0b0b0d]">
            -{discount}%
          </span>
        )}
        {product.isNew && (
          <span className="rounded-lg bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-[#0b0b0d]">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="rounded-lg border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition opacity-0 group-hover:opacity-100 ${
          liked
            ? "border-emerald-300 bg-emerald-300/20 text-emerald-200"
            : "border-white/10 bg-[#0b0b0d]/60 text-white/40 hover:text-white"
        }`}
        aria-label="Toggle wishlist"
      >
        <FiHeart size={14} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square w-full overflow-hidden bg-[#18181b] p-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="p-5">
        <p className="text-[10px] text-white/40 mb-1">{product.shopName}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-base text-white leading-snug line-clamp-2 hover:text-emerald-200 transition mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <AiFillStar size={12} className="text-emerald-300" />
          <span className="text-xs text-white/70">{product.rating}</span>
          <span className="text-xs text-white/30">({product.reviews})</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-white/30 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-emerald-300 hover:text-[#0b0b0d] hover:border-emerald-300 transition"
          >
            <FiShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


