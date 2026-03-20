import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiRefreshCw,
  FiMail,
  FiMapPin,
  FiCreditCard,
  FiHeart,
  FiLogOut,
  FiTruck,
  FiCamera,
  FiArrowRight,
  FiClock,
  FiTrash2,
  FiPhone,
  FiHome,
} from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../server";
import { logoutUser } from "../../redux/actions/user";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/cards/ProductCard";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition";

const statusStyles = {
  Processing: {
    pill: "bg-amber-300/20 text-amber-200 border border-amber-300/30",
    dot: "bg-amber-300",
  },
  Shipped: {
    pill: "bg-sky-300/20 text-sky-200 border border-sky-300/30",
    dot: "bg-sky-300",
  },
  Delivered: {
    pill: "bg-emerald-300/20 text-emerald-200 border border-emerald-300/30",
    dot: "bg-emerald-300",
  },
  "In Transit": {
    pill: "bg-sky-300/20 text-sky-200 border border-sky-300/30",
    dot: "bg-sky-300",
  },
  "Out for Delivery": {
    pill: "bg-emerald-300/20 text-emerald-200 border border-emerald-300/30",
    dot: "bg-emerald-300",
  },
  "Label Created": {
    pill: "bg-white/10 text-white border border-white/20",
    dot: "bg-white/40",
  },
  Cancelled: {
    pill: "bg-rose-300/20 text-rose-200 border border-rose-300/30",
    dot: "bg-rose-300",
  },
};

const mockOrders = [
  {
    id: "7463-HVBF-28820",
    status: "Processing",
    items: 1,
    total: 120,
    currency: "USD",
    date: "Mar 17, 2026",
    updated: "Mar 16, 2026",
  },
  {
    id: "8420-KJTR-30002",
    status: "Shipped",
    items: 3,
    total: 342,
    currency: "USD",
    date: "Mar 12, 2026",
    updated: "Mar 15, 2026",
  },
  {
    id: "4200-ZXCV-90011",
    status: "Delivered",
    items: 2,
    total: 199,
    currency: "USD",
    date: "Feb 28, 2026",
    updated: "Mar 02, 2026",
  },
];

const mockRefunds = [
  {
    id: "RF-10440",
    orderId: "8420-KJTR-30002",
    status: "Processing",
    items: 1,
    total: 68,
    currency: "USD",
    reason: "Damaged on arrival",
    updated: "Mar 16, 2026",
  },
  {
    id: "RF-10412",
    orderId: "4200-ZXCV-90011",
    status: "Delivered",
    items: 2,
    total: 199,
    currency: "USD",
    reason: "Wrong size",
    updated: "Mar 05, 2026",
  },
];

const mockTracking = [
  {
    id: "TRK-785221",
    orderId: "7463-HVBF-28820",
    status: "In Transit",
    items: 1,
    total: 120,
    currency: "USD",
    carrier: "DHL Express",
    eta: "Mar 20, 2026",
    updated: "Mar 17, 2026",
  },
  {
    id: "TRK-900144",
    orderId: "8420-KJTR-30002",
    status: "Out for Delivery",
    items: 3,
    total: 342,
    currency: "USD",
    carrier: "UPS",
    eta: "Mar 18, 2026",
    updated: "Mar 17, 2026",
  },
];

const mockPayments = [
  {
    id: "card-1",
    label: "Visa",
    holder: "Amara Khan",
    last4: "4242",
    exp: "08/28",
    cvv: "***",
    isDefault: true,
  },
  {
    id: "card-2",
    label: "Mastercard",
    holder: "Studio Blanc",
    last4: "8844",
    exp: "12/27",
    cvv: "***",
    isDefault: false,
  },
];

const mockAddresses = [
  {
    id: "addr-1",
    label: "Home (Default)",
    name: "Amara Khan",
    line1: "23 Ocean Avenue",
    line2: "Apt 12B, Karachi",
    phone: "+92 300 0000000",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Studio",
    name: "Studio Blanc",
    line1: "14 Design Street",
    line2: "Phase 6, DHA",
    phone: "+92 333 1112233",
    isDefault: false,
  },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    zip: user?.zip || "",
    address1: user?.address1 || "",
    address2: user?.address2 || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `${backend_url}${user.avatar}` : "https://i.pravatar.cc/160?u=default"
  );
  const [message, setMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(mockOrders[0]);
  const [selectedRefund, setSelectedRefund] = useState(mockRefunds[0]);
  const [selectedTrack, setSelectedTrack] = useState(mockTracking[0]);

  const tabs = useMemo(
    () => [
      { key: "profile", label: "Profile", icon: FiUser },
      { key: "orders", label: "Orders", icon: FiPackage },
      { key: "refunds", label: "Refunds", icon: FiRefreshCw },
      { key: "inbox", label: "Inbox", icon: FiMail },
      { key: "track", label: "Track Order", icon: FiTruck },
      { key: "payments", label: "Payment Methods", icon: FiCreditCard },
      { key: "address", label: "Address", icon: FiMapPin },
      { key: "wishlist", label: "Wishlist", icon: FiHeart },
      { key: "logout", label: "Log out", icon: FiLogOut },
    ],
    []
  );

  const handleChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setMessage("Profile updated (local only).");
    setTimeout(() => setMessage(""), 2500);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
    } finally {
      localStorage.removeItem("sellerAuth");
      navigate("/");
      window.location.reload();
    }
  };

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full p-[3px] bg-gradient-to-br from-emerald-300 to-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="h-full w-full rounded-full object-cover border border-[#0b0b0d]"
                />
              </div>
              <label className="absolute bottom-2 right-1 flex items-center gap-1 cursor-pointer rounded-full bg-white text-[#0b0b0d] text-xs font-semibold px-2 py-1 shadow-lg opacity-90 group-hover:opacity-100">
                <FiCamera size={12} />
                Edit
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatar} />
              </label>
            </div>
            <p className="text-white font-semibold">{profile.name || "Your name"}</p>
            <p className="text-white/50 text-sm">{profile.email || "your@email.com"}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-white/40">Full Name</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40">Email Address</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40">Phone Number</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+92 300 0000000"
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40">Zip Code</label>
              <input
                name="zip"
                value={profile.zip}
                onChange={handleChange}
                placeholder="74000"
                className={inputClass}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs text-white/40">Address 1</label>
              <input
                name="address1"
                value={profile.address1}
                onChange={handleChange}
                placeholder="Address line 1"
                className={inputClass}
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs text-white/40">Address 2</label>
              <input
                name="address2"
                value={profile.address2}
                onChange={handleChange}
                placeholder="Address line 2"
                className={inputClass}
              />
            </div>
          </div>

          {message && <p className="text-sm text-emerald-300">{message}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
            >
              Update
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === "orders") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Your orders</p>
              <h2 className="text-xl font-Playfair font-semibold text-white">Order history</h2>
            </div>
            <span className="text-xs text-white/40">{mockOrders.length} orders</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f0f12] overflow-hidden">
            <div className="grid grid-cols-4 gap-3 px-4 py-3 text-[11px] uppercase tracking-widest text-white/30">
              <span>Order ID</span>
              <span>Status</span>
              <span className="text-center">Items Qty</span>
              <span className="text-right">Total</span>
            </div>
            <div className="divide-y divide-white/5">
              {mockOrders.map((order) => {
                const isActive = selectedOrder?.id === order.id;
                const style =
                  statusStyles[order.status] || {
                    pill: "bg-white/10 text-white border border-white/10",
                    dot: "bg-white/40",
                  };
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`grid w-full grid-cols-4 items-center gap-3 px-4 py-4 text-left transition ${
                      isActive
                        ? "bg-white/5 border-l-2 border-emerald-300/60 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{order.id}</p>
                      <p className="text-[11px] text-white/40">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.pill}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-white text-center">{order.items}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-semibold text-white">
                        {order.currency} ${order.total.toFixed(2)}
                      </span>
                      <FiArrowRight size={14} className="text-white/40" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedOrder && (
            <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4">
              <p className="text-[10px] uppercase tracking-widest text-emerald-200 mb-3">Selected order</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Order ID</p>
                  <p className="text-sm font-semibold text-white truncate">{selectedOrder.id}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Status</p>
                  <p className="text-sm font-semibold text-white">{selectedOrder.status}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Items Qty</p>
                  <p className="text-sm font-semibold text-white">{selectedOrder.items}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Total</p>
                  <p className="text-sm font-semibold text-white">
                    {selectedOrder.currency} ${selectedOrder.total.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/60">Last updated: {selectedOrder.updated}</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "refunds") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Refunds</p>
              <h2 className="text-xl font-Playfair font-semibold text-white">Refund requests</h2>
            </div>
            <span className="text-xs text-white/40">{mockRefunds.length} requests</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f0f12] overflow-hidden">
            <div className="grid grid-cols-4 gap-3 px-4 py-3 text-[11px] uppercase tracking-widest text-white/30">
              <span>Refund ID</span>
              <span>Status</span>
              <span className="text-center">Items Qty</span>
              <span className="text-right">Total</span>
            </div>
            <div className="divide-y divide-white/5">
              {mockRefunds.map((refund) => {
                const isActive = selectedRefund?.id === refund.id;
                const style =
                  statusStyles[refund.status] || {
                    pill: "bg-white/10 text-white border border-white/10",
                    dot: "bg-white/40",
                  };
                return (
                  <button
                    key={refund.id}
                    onClick={() => setSelectedRefund(refund)}
                    className={`grid w-full grid-cols-4 items-center gap-3 px-4 py-4 text-left transition ${
                      isActive
                        ? "bg-white/5 border-l-2 border-emerald-300/60 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{refund.id}</p>
                      <p className="text-[11px] text-white/40">Order {refund.orderId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.pill}`}>
                        {refund.status}
                      </span>
                    </div>
                    <p className="text-sm text-white text-center">{refund.items}</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-semibold text-white">
                        {refund.currency} ${refund.total.toFixed(2)}
                      </span>
                      <FiArrowRight size={14} className="text-white/40" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedRefund && (
            <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4">
              <p className="text-[10px] uppercase tracking-widest text-emerald-200 mb-3">Selected refund</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Refund ID</p>
                  <p className="text-sm font-semibold text-white truncate">{selectedRefund.id}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Order</p>
                  <p className="text-sm font-semibold text-white">{selectedRefund.orderId}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Status</p>
                  <p className="text-sm font-semibold text-white">{selectedRefund.status}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Total</p>
                  <p className="text-sm font-semibold text-white">
                    {selectedRefund.currency} ${selectedRefund.total.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3 sm:col-span-2">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Reason</p>
                  <p className="text-sm font-semibold text-white">{selectedRefund.reason}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/60">Updated: {selectedRefund.updated}</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "track") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Tracking</p>
              <h2 className="text-xl font-Playfair font-semibold text-white">Track orders</h2>
            </div>
            <span className="text-xs text-white/40">{mockTracking.length} shipments</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f0f12] overflow-hidden">
            <div className="grid grid-cols-5 gap-3 px-4 py-3 text-[11px] uppercase tracking-widest text-white/30">
              <span>Tracking ID</span>
              <span>Status</span>
              <span className="text-center">Items</span>
              <span className="text-right">Total</span>
              <span className="text-right">ETA</span>
            </div>
            <div className="divide-y divide-white/5">
              {mockTracking.map((track) => {
                const isActive = selectedTrack?.id === track.id;
                const style =
                  statusStyles[track.status] || {
                    pill: "bg-white/10 text-white border border-white/10",
                    dot: "bg-white/40",
                  };
                return (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track)}
                    className={`grid w-full grid-cols-5 items-center gap-3 px-4 py-4 text-left transition ${
                      isActive
                        ? "bg-white/5 border-l-2 border-emerald-300/60 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{track.id}</p>
                      <p className="text-[11px] text-white/40">Order {track.orderId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.pill}`}>
                        {track.status}
                      </span>
                    </div>
                    <p className="text-sm text-white text-center">{track.items}</p>
                    <p className="text-sm font-semibold text-white text-right">
                      {track.currency} ${track.total.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-sm text-white">
                      <FiClock size={13} className="text-white/40" />
                      <span>{track.eta}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedTrack && (
            <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-emerald-200">Selected shipment</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Tracking ID</p>
                  <p className="text-sm font-semibold text-white">{selectedTrack.id}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Order</p>
                  <p className="text-sm font-semibold text-white">{selectedTrack.orderId}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Status</p>
                  <p className="text-sm font-semibold text-white">{selectedTrack.status}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">ETA</p>
                  <p className="text-sm font-semibold text-white">{selectedTrack.eta}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Carrier</p>
                  <p className="text-sm font-semibold text-white">{selectedTrack.carrier}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Items Qty</p>
                  <p className="text-sm font-semibold text-white">{selectedTrack.items}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Total</p>
                  <p className="text-sm font-semibold text-white">
                    {selectedTrack.currency} ${selectedTrack.total.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/60">Last update: {selectedTrack.updated}</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "payments") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Payments</p>
              <h2 className="text-xl font-Playfair font-semibold text-white">Payment methods</h2>
            </div>
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:border-white/30 transition">
              + Add new
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {mockPayments.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl border ${card.isDefault ? "border-emerald-300/40" : "border-white/10"} bg-[#0f0f12] p-4 space-y-3 shadow-[0_15px_40px_rgba(0,0,0,0.35)]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
                      {card.label.slice(0,2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{card.label} •••• {card.last4}</p>
                      <p className="text-xs text-white/40">{card.holder}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.isDefault && (
                      <span className="rounded-full bg-emerald-300/15 text-emerald-200 border border-emerald-300/40 px-2 py-1 text-[10px] font-semibold uppercase">
                        Default
                      </span>
                    )}
                    <button className="text-white/40 hover:text-rose-300 transition">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-white/60">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Name</p>
                    <p className="font-semibold text-white">{card.holder}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">CVV</p>
                    <p className="font-semibold text-white">{card.cvv}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Exp</p>
                    <p className="font-semibold text-white">{card.exp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "address") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Addresses</p>
              <h2 className="text-xl font-Playfair font-semibold text-white">Delivery addresses</h2>
            </div>
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:border-white/30 transition">
              + Add address
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {mockAddresses.map((addr) => (
              <div
                key={addr.id}
                className={`rounded-2xl border ${addr.isDefault ? "border-emerald-300/40" : "border-white/10"} bg-[#0f0f12] p-4 space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiHome size={14} className="text-emerald-200" />
                    <div>
                      <p className="text-sm font-semibold text-white">{addr.label}</p>
                      {addr.isDefault && (
                        <span className="text-[11px] text-emerald-200 uppercase font-semibold">Default</span>
                      )}
                    </div>
                  </div>
                  <button className="text-white/40 hover:text-rose-300 transition">
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {addr.line1}
                  <br />
                  {addr.line2}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span className="font-semibold text-white">{addr.name}</span>
                  <div className="flex items-center gap-1 text-white/50">
                    <FiPhone size={12} />
                    <span>{addr.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "wishlist") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Saved items</p>
              <h2 className="text-xl font-Playfair font-semibold text-white">Wishlist</h2>
            </div>
            <span className="text-xs text-white/40">{wishlist.length} items</span>
          </div>
          {wishlist.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#0f0f12] p-6 text-sm text-white/60">
              No items saved yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 text-white/70">
        <p className="text-sm">This section is not implemented yet.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-16">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="rounded-2xl border border-white/10 bg-[#111114] p-4">
            <ul className="space-y-2 text-sm">
              {tabs.map(({ key, label, icon: Icon }) => (
                <li key={key}>
                  <button
                    onClick={() => {
                      if (key === "logout") {
                        handleLogout();
                      } else {
                        setActiveTab(key);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition ${
                      activeTab === key
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default ProfilePage;
