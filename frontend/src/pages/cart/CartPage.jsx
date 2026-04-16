import React from "react";
import { Link } from "react-router-dom";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowRight,
  FiShoppingCart,
} from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../context/CartContext";
import { resolveAvailableStock } from "../../utils/marketplace";

const CartPage = () => {
  const { cartItems, updateQty, removeFromCart, cartTotal, clearCart } = useCart();

  const shipping = cartTotal > 80 ? 0 : 9.99;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
            Your bag
          </p>
          <h1 className="text-3xl font-Playfair font-semibold text-white">
            Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 mb-6">
              <FiShoppingCart size={32} className="text-white/30" />
            </div>
            <p className="text-xl font-Playfair text-white/50 mb-2">Your cart is empty</p>
            <p className="text-sm text-white/30 mb-6">
              Looks like you haven't added anything yet.
            </p>
            <Link
              to="/products"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
            >
              Start Shopping <FiArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const stock = resolveAvailableStock(item);
                const soldOut = stock <= 0;
                const limitReached = !soldOut && item.qty >= stock;

                return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-[#111114] p-4 sm:p-5"
                >
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-xl bg-[#18181b]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-white/30 mb-0.5">
                          {item.shopName}
                        </p>
                        <Link
                          to={`/product/${item.id}`}
                          className="text-sm font-medium text-white hover:text-emerald-200 transition line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30 transition"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Qty */}
                      <div className="flex items-center gap-0 rounded-lg border border-white/10 overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="flex h-8 w-8 items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          disabled={soldOut || limitReached}
                          className={`flex h-8 w-8 items-center justify-center transition ${
                            soldOut || limitReached
                              ? "cursor-not-allowed text-white/20"
                              : "text-white/50 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                        {item.qty > 1 && (
                          <p className="text-xs text-white/30">
                            ${item.price} each
                          </p>
                        )}
                        {soldOut ? (
                          <p className="text-xs text-rose-300">
                            This item is sold out. Quantity can&apos;t be increased.
                          </p>
                        ) : limitReached ? (
                          <p className="text-xs text-amber-300">
                            Stock is limited. You already have the maximum available quantity.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )})}

              <button
                onClick={clearCart}
                className="text-xs text-white/30 hover:text-white/60 transition"
              >
                Clear cart
              </button>
            </div>

            {/* Order summary */}
            <div>
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#111114] p-6">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-5">
                  Order Summary
                </p>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-emerald-300" : ""}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-white/30">
                      Add ${(80 - cartTotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-semibold text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
                >
                  Checkout <FiArrowRight size={14} />
                </Link>

                <Link
                  to="/products"
                  className="mt-3 flex w-full items-center justify-center text-xs text-white/40 hover:text-white transition py-2"
                >
                  &larr; Continue shopping
                </Link>

                {/* Trust */}
                <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-white/20">
                  <span>&#128274;</span>
                  <span>Secure | Encrypted | Trusted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
