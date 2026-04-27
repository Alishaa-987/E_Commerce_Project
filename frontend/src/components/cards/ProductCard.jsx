import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { resolveAvailableStock } from "../../utils/marketplace";

const ProductCard = ({ product }) => {
  const { addToCart, getCartItemQty, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [cartFeedback, setCartFeedback] = useState("");

  const productId = product?.id || product?._id || "";
  const stock = resolveAvailableStock(product);
  const soldOut = stock <= 0;
  const liked = isWishlisted(product);
  const inCart = isInCart(product);
  const cartQty = getCartItemQty(product);
  const remainingToAdd = Math.max(stock - cartQty, 0);
  const limitReached = !soldOut && remainingToAdd === 0;
  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  useEffect(() => {
    if (!cartFeedback) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCartFeedback("");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [cartFeedback]);

  const handleAddToCart = () => {
    const result = addToCart(product);

    setCartFeedback(result.message);
  };

  const statusText = cartFeedback
    ? cartFeedback
    : soldOut || limitReached
    ? "Out of stock"
    : inCart
    ? `In cart (${cartQty})`
    : "";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111114] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {soldOut && (
          <span className="rounded-lg border border-rose-300/40 bg-rose-300/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-rose-300">
            Out of stock
          </span>
        )}
        {discount && (
          <span className="rounded-lg bg-emerald-300 px-2 py-0.5 text-[10px] font-bold uppercase text-[#0b0b0d]">
            -{discount}%
          </span>
        )}
        {product?.isNew && (
          <span className="rounded-lg bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-[#0b0b0d]">
            New
          </span>
        )}
        {product?.isBestSeller && (
          <span className="rounded-lg border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur">
            Best Seller
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={toggleWishlist.bind(null, product)}
        className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition ${
          liked
            ? "border-emerald-300 bg-emerald-300/20 text-emerald-200 opacity-100"
            : "border-white/10 bg-[#0b0b0d]/60 text-white/40 opacity-0 group-hover:opacity-100 hover:text-white"
        }`}
        aria-label="Toggle wishlist"
      >
        <FiHeart size={14} fill={liked ? "currentColor" : "none"} />
      </button>

      <Link to={`/product/${productId}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-[#18181b] p-4">
          <img
            src={product?.image}
            alt={product?.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-6">
        <p className="mb-1.5 text-xs text-white/40">{product?.shopName}</p>
        <Link to={`/product/${productId}`}>
          <h3 className="mb-2.5 line-clamp-2 text-lg font-medium leading-snug text-white transition hover:text-emerald-200">
            {product?.name}
          </h3>
        </Link>

        <div className="mb-4 flex items-center gap-1.5">
          <AiFillStar size={14} className="text-emerald-300" />
          <span className="text-sm text-white/70">{product?.rating || 0}</span>
          <span className="text-sm text-white/30">
            ({product?.reviews?.length || 0})
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-white">
              ${product?.price}
            </span>
            {product?.originalPrice && (
              <span className="text-sm text-white/30 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            title={
              soldOut || limitReached
                ? "Out of stock"
                : inCart
                ? `In cart (${cartQty})`
                : "Add to cart"
            }
            disabled={soldOut || limitReached}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              soldOut || limitReached
                ? "cursor-not-allowed border-white/10 bg-white/5 text-white/40"
                : inCart
                ? "border-emerald-300/30 bg-emerald-300/20 text-emerald-200"
                : "border-white/10 bg-white/5 text-white/60 hover:border-emerald-300 hover:bg-emerald-300 hover:text-[#0b0b0d]"
            }`}
            aria-label={soldOut || limitReached ? "Out of stock" : "Add to cart"}
          >
            <FiShoppingCart size={16} />
          </button>
        </div>

        <p
          className={`mt-2 min-h-[1rem] text-xs ${
            cartFeedback
              ? "text-emerald-300"
              : soldOut || limitReached
              ? "text-rose-300"
              : inCart
              ? "text-white/30"
              : "text-white/30"
          }`}
        >
          {statusText}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
