import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
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

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
            Favorites
          </p>
          <h1 className="text-3xl font-Playfair font-semibold text-white">
            Wishlist
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 mb-6">
              <FiHeart size={32} className="text-white/30" />
            </div>
            <p className="text-xl font-Playfair text-white/50 mb-2">
              Your wishlist is empty
            </p>
            <p className="text-sm text-white/30 mb-6">
              Save items to keep track and buy later.
            </p>
            <Link
              to="/products"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => {
              const stock = resolveAvailableStock(item);
              const soldOut = stock <= 0;
              const limitReached = stock > 0 && getCartItemQty(item) >= stock;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#111114] overflow-hidden"
                >
                  <Link to={`/product/${item.id}`}>
                    <div className="aspect-square bg-[#18181b] p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </Link>
                  <div className="p-4 space-y-2">
                    <p className="text-[10px] text-white/40">{item.shopName}</p>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-sm font-medium text-white hover:text-emerald-200 transition line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-semibold text-white">
                        ${item.price}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition"
                          aria-label="Remove from wishlist"
                        >
                          <FiTrash2 size={14} />
                        </button>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={soldOut || limitReached}
                          title={
                            soldOut
                              ? "This product is sold out"
                              : limitReached
                              ? "Stock limit reached"
                              : isInCart(item)
                              ? "In cart"
                              : "Add to cart"
                          }
                          className={`h-9 px-3 flex items-center gap-1 rounded-lg text-sm font-semibold transition ${
                            soldOut
                              ? "cursor-not-allowed border border-rose-300/20 bg-rose-300/10 text-rose-200"
                              : limitReached
                              ? "cursor-not-allowed border border-amber-300/30 bg-amber-300/10 text-amber-200"
                              : isInCart(item)
                              ? "border border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                              : "bg-white text-[#0b0b0d] hover:-translate-y-0.5"
                          }`}
                        >
                          <FiShoppingCart size={14} />
                          {soldOut
                            ? "Sold out"
                            : limitReached
                            ? "Stock limit"
                            : isInCart(item)
                            ? "In cart"
                            : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;
