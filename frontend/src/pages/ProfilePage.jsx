import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiEdit3,
  FiCheck,
} from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const mockOrders = [
  {
    id: "LM-001",
    date: "Feb 28, 2026",
    status: "Delivered",
    total: 219,
    items: [
      {
        name: "Atelier Leather Tote",
        image:
          "https://images.pexels.com/photos/27204286/pexels-photo-27204286.jpeg?auto=compress&cs=tinysrgb&w=80",
        price: 219,
        qty: 1,
      },
    ],
  },
  {
    id: "LM-002",
    date: "Mar 1, 2026",
    status: "In Transit",
    total: 287,
    items: [
      {
        name: "Nova Wireless Headphones",
        image:
          "https://images.pexels.com/photos/15840650/pexels-photo-15840650.jpeg?auto=compress&cs=tinysrgb&w=80",
        price: 199,
        qty: 1,
      },
      {
        name: "Serenity Soy Candle",
        image:
          "https://images.pexels.com/photos/30676121/pexels-photo-30676121.jpeg?auto=compress&cs=tinysrgb&w=80",
        price: 88,
        qty: 2,
      },
    ],
  },
  {
    id: "LM-003",
    date: "Mar 3, 2026",
    status: "Processing",
    total: 459,
    items: [
      {
        name: "Prestige Gold Watch",
        image:
          "https://images.pexels.com/photos/12835314/pexels-photo-12835314.jpeg?auto=compress&cs=tinysrgb&w=80",
        price: 459,
        qty: 1,
      },
    ],
  },
];

const statusColor = {
  Delivered: "text-emerald-300 bg-emerald-300/10 border-emerald-300/20",
  "In Transit": "text-sky-300 bg-sky-300/10 border-sky-300/20",
  Processing: "text-amber-300 bg-amber-300/10 border-amber-300/20",
  Cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

const tabs = [
  { key: "profile", label: "Profile", Icon: FiUser },
  { key: "orders", label: "My Orders", Icon: FiPackage },
  { key: "wishlist", label: "Wishlist", Icon: FiHeart },
];

const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alisha Fatima",
    email: "alisha@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Lover of well-crafted things.",
  });

  const setTab = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    setSearchParams(params);
  };

  const handleSave = () => {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-center gap-5">
          <img
            src="https://i.pravatar.cc/80?u=alisha-profile"
            alt="Profile"
            className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
          />
          <div>
            <h1 className="text-2xl font-Playfair font-semibold text-white">
              {profile.name}
            </h1>
            <p className="text-sm text-white/40">{profile.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-white/10 mb-8">
          {tabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm transition border-b-2 -mb-px ${
                activeTab === key
                  ? "border-white text-white font-medium"
                  : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-lg space-y-5 animate-fade-up">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest text-white/30">
                Personal Info
              </p>
              {saved && (
                <span className="flex items-center gap-1 text-xs text-emerald-300">
                  <FiCheck size={12} /> Saved
                </span>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 space-y-4">
              {[
                { label: "Full Name", key: "name", placeholder: "Your name" },
                { label: "Email", key: "email", placeholder: "your@email.com" },
                { label: "Phone", key: "phone", placeholder: "+1 (555) 000-0000" },
                { label: "Bio", key: "bio", placeholder: "About you" },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs text-white/40">{label}</label>
                  {isEditing ? (
                    <input
                      value={profile[key]}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/30 outline-none transition"
                    />
                  ) : (
                    <p className="text-sm text-white/70 px-1">
                      {profile[key] || (
                        <span className="text-white/20">{placeholder}</span>
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
                  >
                    <FiCheck size={14} /> Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/50 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/60 hover:text-white transition"
                >
                  <FiEdit3 size={14} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-fade-up">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">
              {mockOrders.length} orders
            </p>
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-white/10 bg-[#111114] p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-white/30">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-lg border px-3 py-1 text-xs font-medium ${
                        statusColor[order.status] ||
                        "text-white/50 bg-white/5 border-white/10"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      ${order.total}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-white/70 max-w-[140px] truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-white/30">
                          x{item.qty} · ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.status === "Delivered" && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-white/30">
                    <AiFillStar size={11} className="text-emerald-300" />
                    <span>
                      Leave a review ·{" "}
                      <Link to={`/product/1`} className="text-emerald-200 hover:text-white transition">
                        Rate this product
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 mb-5">
              <FiHeart size={24} className="text-white/30" />
            </div>
            <p className="text-lg font-Playfair text-white/40 mb-2">No saved items</p>
            <p className="text-sm text-white/25 mb-6">
              Tap the heart icon on any product to save it here.
            </p>
            <Link
              to="/products"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
