import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const shopLinks = [
    { label: "All Products", to: "/products" },
    { label: "Best Sellers", to: "/products?sort=bestseller" },
    { label: "New Arrivals", to: "/products?sort=new" },
    { label: "Flash Sale", to: "/products?sale=true" },
    { label: "Browse Shops", to: "/products" },
  ];

  const supportLinks = [
    { label: "Help Center", to: "/" },
    { label: "Track Order", to: "/profile?tab=orders" },
    { label: "Returns", to: "/" },
    { label: "Shipping Policy", to: "/" },
    { label: "Privacy Policy", to: "/" },
  ];

  return (
    <footer className="bg-[#0b0b0d] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-white font-semibold">
                Lumen Market
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              A curated multi-vendor marketplace for premium essentials. Quality-verified. Beautifully presented.
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: FiInstagram, href: "#" },
                { Icon: FiTwitter, href: "#" },
                { Icon: FaFacebookF, href: "#" },
                { Icon: FiYoutube, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/30 transition"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-5">
              Shop
            </p>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-5">
              Support
            </p>
            <ul className="space-y-3">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-5">
              Newsletter
            </p>
            <p className="text-sm text-white/50 mb-4 leading-relaxed">
              Get exclusive drops, early access, and style picks - delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-300">
                You're in.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <FiMail size={14} className="text-white/40 shrink-0" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0b0b0d] transition hover:-translate-y-0.5"
                >
                  Subscribe <FiArrowRight size={12} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/30">
          <p>(c) {new Date().getFullYear()} Lumen Market. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/60" />
            <span>Secure checkout | Free returns | Verified sellers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
