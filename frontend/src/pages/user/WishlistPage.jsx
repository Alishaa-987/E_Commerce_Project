import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTrash2, FiChevronRight } from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { resolveAvailableStock } from "../../utils/marketplace";

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, getCartItemQty, isInCart } = useCart();

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 pt-32 pb-16">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-300 mb-2">
              Saved Items
            </p>
            <h1 className="text-4xl font-Playfair font-bold text-white">
              My Wishlist
            </h1>
          </div>
          <div className="text-right">
              <p className="text-2xl font-Playfair font-bold text-white">{wishlist.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/30">Total Items</p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-[32px] border border-dashed border-white/10 bg-white/[0.02]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 mb-6">
              <FiHeart size={32} className="text-white/20" />
            </div>
            <p className="text-xl font-Playfair text-white/60 mb-2">
              Nothing saved yet
            </p>
            <p className="text-sm text-white/30 mb-8 max-w-xs">
              Explore our marketplace and tap the heart icon to save products you love.
            </p>
            <Link
              to="/products"
              className="rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#0b0b0d] transition hover:scale-105 active:scale-95"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => {
              const stock = resolveAvailableStock(item);
              const soldOut = stock <= 0;
              const limitReached = stock > 0 && getCartItemQty(item) >= stock;

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col md:flex-row items-center gap-6 rounded-[28px] border border-white/10 bg-[#111114] p-5 transition hover:border-white/20 hover:bg-white/[0.03]"
                >
                  {/* Image Container */}
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-[#18181b] p-3 border border-white/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Info Container */}
                  <div className="flex flex-1 flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/60">{item.shopName}</span>
                    </div>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-lg font-semibold text-white hover:text-emerald-300 transition truncate"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-2 flex items-center gap-4">
                        <span className="text-xl font-bold text-white">
                            ${item.price}
                        </span>
                        {soldOut && (
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded">
                                Sold Out
                            </span>
                        )}
                    </div>
                  </div>

                  {/* Actions Container */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => addToCart(item)}
                        disabled={soldOut || limitReached}
                        className={`flex-1 md:flex-none h-12 px-6 flex items-center justify-center gap-2 rounded-2xl text-sm font-bold transition ${
                            soldOut || limitReached
                            ? "bg-white/5 text-white/20 cursor-not-allowed"
                            : isInCart(item)
                            ? "bg-emerald-300/10 text-emerald-300 border border-emerald-300/20"
                            : "bg-white text-[#0b0b0d] hover:scale-105"
                        }`}
                    >
                        <FiShoppingCart size={16} />
                        {soldOut ? "Sold Out" : isInCart(item) ? "In Cart" : "Add to Cart"}
                    </button>
                    
                    <button
                        onClick={() => toggleWishlist(item)}
                        className="h-12 w-12 flex items-center justify-center rounded-2xl border border-white/10 text-white/30 hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-400/5 transition"
                        title="Remove from wishlist"
                    >
                        <FiTrash2 size={18} />
                    </button>

                    <Link 
                        to={`/product/${item.id}`}
                        className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-white/30 hover:text-white transition"
                    >
                        <FiChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default WishlistPage;
