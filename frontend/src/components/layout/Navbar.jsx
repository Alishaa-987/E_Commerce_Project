import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useSelector } from "react-redux";
import { deriveCategories, toAbsoluteAssetUrl } from "../../utils/marketplace";

const Navbar = () => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const catRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { allProducts } = useSelector((state) => state.products);
  const categories = deriveCategories(allProducts).slice(0, 8);
  const isSellerAuthenticated =
    typeof window !== "undefined" && window.localStorage.getItem("sellerAuth") === "true";
  const sellerShopName =
    typeof window !== "undefined" ? window.localStorage.getItem("sellerShopName") || "" : "";
  const sellerEmail =
    typeof window !== "undefined" ? window.localStorage.getItem("sellerEmail") || "" : "";
  const sellerAvatar = toAbsoluteAssetUrl(
    typeof window !== "undefined" ? window.localStorage.getItem("sellerAvatar") || "" : ""
  );
  const userAvatar = toAbsoluteAssetUrl(user?.avatar || "");
  const sellerAvatarLabel = sellerShopName.trim().charAt(0).toUpperCase() || "S";
  const userAvatarLabel = (user?.name || "U").trim().charAt(0).toUpperCase();
  const isAccountLoggedIn = isAuthenticated || isSellerAuthenticated;

  useEffect(() => {
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0b0d]/95 backdrop-blur-xl border-b border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-[70px] items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 animate-glow" />
              <span className="text-xl font-Playfair font-semibold text-white">
                Lumen
              </span>
            </Link>

            {/* Categories - desktop */}
            <div
              ref={catRef}
              className="hidden md:flex relative items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 hover:text-white transition cursor-pointer"
              onClick={() => setIsCatOpen(!isCatOpen)}
            >
              <FiMenu size={13} />
              <span>Categories</span>
              <FiChevronDown
                size={14}
                className={`transition ${isCatOpen ? "rotate-180" : ""}`}
              />
              {isCatOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#111114] shadow-lg p-2 animate-fade-in">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-white/30">{cat.count}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search bar - desktop */}
            <form
              onSubmit={handleSearch}
              className={`hidden md:flex items-center gap-2 rounded-xl border bg-white/5 px-3 py-2 transition-all duration-300 ${
                isSearchFocused
                  ? "border-white/30 w-72"
                  : "border-white/10 w-52"
              }`}
            >
              <button
                type="submit"
                className="text-white/60 hover:text-white transition"
                aria-label="Search"
              >
                <FiSearch size={14} className="shrink-0" />
              </button>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Seller CTA */}
              {isSellerAuthenticated ? (
                <Link
                  to="/seller/dashboard"
                  className="hidden lg:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  {sellerAvatar ? (
                    <img
                      src={sellerAvatar}
                      alt={sellerShopName || "Seller profile"}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-300/15 text-[10px] text-emerald-200">
                      {sellerAvatarLabel}
                    </span>
                  )}
                  Seller Dashboard
                </Link>
              ) : (
                <Link
                  to="/seller-login"
                  className="hidden lg:inline-flex items-center rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#0b0b0d] transition hover:-translate-y-0.5"
                >
                  Become Seller
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 transition relative"
              >
                <FiHeart size={16} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-300 text-[9px] font-bold text-[#0b0b0d]">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 transition"
              >
                <FiShoppingCart size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-300 text-[9px] font-bold text-[#0b0b0d]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              {isAuthenticated ? (
                <Link to="/profile">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={user?.name || "Profile"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white/70">
                      {userAvatarLabel}
                    </span>
                  )}
                </Link>
              ) : isSellerAuthenticated ? (
                <Link to="/seller/profile">
                  {sellerAvatar ? (
                    <img
                      src={sellerAvatar}
                      alt={sellerShopName || "Seller profile"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-emerald-200">
                      {sellerAvatarLabel}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 transition"
                >
                  <FiUser size={16} />
                </Link>
              )}

              {/* Login CTA - desktop */}
              {!isAccountLoggedIn && (
                <Link
                  to="/login"
                  className="hidden md:block rounded-xl bg-white px-4 py-2 text-[11px] font-semibold text-[#0b0b0d] uppercase tracking-wider transition hover:-translate-y-0.5"
                >
                  Sign in
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 transition"
                aria-label="Open menu"
              >
                <FiMenu size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b0b0d]/80 backdrop-blur-lg animate-fade-in md:hidden">
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-[#111114] border-l border-white/10 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[10px] uppercase tracking-widest text-white/40">
                Menu
              </p>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white transition"
                aria-label="Close menu"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Search bar - mobile */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 mb-6"
            >
              <button type="submit" className="text-white/60 hover:text-white transition" aria-label="Search">
                <FiSearch size={14} />
              </button>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
            </form>

            {/* Nav Links */}
            <div className="space-y-1 mb-6">
              {[
                { label: "Home", to: "/" },
                { label: "All Products", to: "/products" },
                ...(isSellerAuthenticated
                  ? [{ label: "Seller Dashboard", to: "/seller/dashboard" }]
                  : [{ label: "Become Seller", to: "/seller-login" }]),
                { label: "Wishlist", to: "/wishlist" },
                { label: "Cart", to: "/cart" },
                ...(isAuthenticated
                  ? [
                      { label: "My Profile", to: "/profile" },
                      { label: "My Orders", to: "/profile?tab=orders" },
                    ]
                  : []),
                ...(!isAuthenticated && isSellerAuthenticated
                  ? [{ label: "Seller Profile", to: "/seller/profile" }]
                  : []),
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80 hover:border-white/30 hover:text-white transition"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="profile"
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white/70">
                      {userAvatarLabel}
                    </span>
                  )}
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm">{user.name || "My profile"}</span>
                    <span className="text-xs text-white/40 truncate">{user.email || "View profile"}</span>
                  </div>
                </Link>
              ) : isSellerAuthenticated ? (
                <Link
                  to="/seller/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80 hover:border-white/30 hover:text-white transition"
                >
                  {sellerAvatar ? (
                    <img
                      src={sellerAvatar}
                      alt={sellerShopName || "Seller profile"}
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-emerald-200">
                      {sellerAvatarLabel}
                    </span>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {sellerShopName || "Seller profile"}
                    </span>
                    <span className="text-xs text-white/40 truncate">
                      {sellerEmail || "Open seller dashboard"}
                    </span>
                  </div>
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-[#0b0b0d]"
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full rounded-xl border border-white/20 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
