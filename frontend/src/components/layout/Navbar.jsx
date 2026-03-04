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
import { categories } from "../../data/mockData";

const Navbar = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const catRef = useRef(null);

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
        <div className="mx-auto max-w-7xl px-5 sm:px-7">
          <div className="flex h-[74px] items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 animate-glow" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-white font-semibold">
                Lumen Market
              </span>
            </Link>

            {/* Categories dropdown — desktop */}
            <div className="relative hidden md:block" ref={catRef}>
              <button
                onClick={() => setIsCatOpen((p) => !p)}
                className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition"
              >
                Categories
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isCatOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isCatOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 rounded-2xl border border-white/10 bg-[#111114] shadow-[0_20px_60px_rgba(0,0,0,0.6)] py-2 animate-fade-up">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setIsCatOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-white/30">{cat.count}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search bar — desktop */}
            <form
              onSubmit={handleSearch}
              className={`hidden md:flex items-center gap-2 rounded-xl border bg-white/5 px-3 py-2 transition-all duration-300 ${
                isSearchFocused
                  ? "border-white/30 w-72"
                  : "border-white/10 w-52"
              }`}
            >
              <FiSearch size={14} className="text-white/40 shrink-0" />
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
              {/* Wishlist */}
              <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 transition">
                <FiHeart size={16} />
              </button>

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
              <Link
                to="/profile"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30 transition"
              >
                <FiUser size={16} />
              </Link>

              {/* Login CTA — desktop */}
              <Link
                to="/login"
                className="hidden md:block rounded-xl bg-white px-4 py-2 text-[11px] font-semibold text-[#0b0b0d] uppercase tracking-wider transition hover:-translate-y-0.5"
              >
                Sign in
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60"
              >
                <FiMenu size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative ml-auto w-72 bg-[#111114] h-full flex flex-col p-6 overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[11px] uppercase tracking-[0.4em] text-white/70">
                Menu
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 text-white/60"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 mb-6">
              <FiSearch size={14} className="text-white/40" />
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
                { label: "Cart", to: "/cart" },
                { label: "My Profile", to: "/profile" },
                { label: "My Orders", to: "/profile?tab=orders" },
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

            {/* Categories */}
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 px-3">
              Categories
            </p>
            <div className="space-y-1 mb-8">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-white/30">{cat.count}</span>
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
