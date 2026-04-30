import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiRefreshCw,
  FiMail,
  FiMapPin,
  FiLock,
  FiHeart,
  FiLogOut,
  FiTruck,
  FiCamera,
  FiArrowRight,
  FiClock,
  FiTrash2,
} from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import AddressModal from "../../components/user/AddressModal";
import SavedAddressRow from "../../components/user/SavedAddressRow";
import Inbox from "../../components/messaging/Inbox";
import {
  addUserAddress,
  deleteUserAddress,
  logoutUser,
  updateUserAddress,
  updateUserPassword,
  updateUserProfile,
} from "../../redux/actions/user";
import { getUserOrders } from "../../redux/actions/order";
import { clearUserFeedback } from "../../redux/reducers/user";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/cards/ProductCard";
import { toAbsoluteAssetUrl } from "../../utils/marketplace";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition";

const validProfileTabs = new Set([
  "profile",
  "orders",
  "refunds",
  "inbox",
  "track",
  "payments",
  "address",
  "wishlist",
  "logout",
]);

const statusStyles = {
  pending: {
    pill: "bg-amber-300/20 text-amber-200 border border-amber-300/30",
    dot: "bg-amber-300",
  },
  processing: {
    pill: "bg-sky-300/20 text-sky-200 border border-sky-300/30",
    dot: "bg-sky-300",
  },
  shipped: {
    pill: "bg-sky-300/20 text-sky-200 border border-sky-300/30",
    dot: "bg-sky-300",
  },
  delivered: {
    pill: "bg-emerald-300/20 text-emerald-200 border border-emerald-300/30",
    dot: "bg-emerald-300",
  },
  "in transit": {
    pill: "bg-sky-300/20 text-sky-200 border border-sky-300/30",
    dot: "bg-sky-300",
  },
  "out for delivery": {
    pill: "bg-emerald-300/20 text-emerald-200 border border-emerald-300/30",
    dot: "bg-emerald-300",
  },
  "label created": {
    pill: "bg-white/10 text-white border border-white/20",
    dot: "bg-white/40",
  },
  cancelled: {
    pill: "bg-rose-300/20 text-rose-200 border border-rose-300/30",
    dot: "bg-rose-300",
  },
};

const getValidProfileTab = (value = "") =>
  validProfileTabs.has(value) && value !== "logout" ? value : "profile";

const formatStatusLabel = (value = "") =>
  String(value || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getStatusStyle = (status = "") =>
  statusStyles[String(status || "pending").trim().toLowerCase()] || {
    pill: "bg-white/10 text-white border border-white/10",
    dot: "bg-white/40",
  };

const formatReadableDate = (value, fallback = "Recently") => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatOrderDisplayId = (value = "") =>
  `ORD-${String(value || "").slice(-8).toUpperCase()}`;

const formatOrderCurrency = (value = 0) => `USD $${Number(value || 0).toFixed(2)}`;

const getOrderItemCount = (order = {}) => {
  if (Number(order?.itemCount || 0) > 0) {
    return Number(order.itemCount || 0);
  }

  if (!Array.isArray(order?.cart)) {
    return 0;
  }

  return order.cart.reduce((sum, item) => sum + Number(item?.qty || 1), 0);
};



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

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {
    user,
    profileUpdateLoading,
    profileUpdateError,
    addressActionLoading,
    addressActionError,
    addressActionId,
    successMessage,
  } = useSelector((state) => state.user);
  const { userOrders, userOrdersLoading, userOrdersError } = useSelector(
    (state) => state.order
  );
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState(() =>
    getValidProfileTab(searchParams.get("tab") || "")
  );
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    currentPassword: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(toAbsoluteAssetUrl(user?.avatar || ""));
  const [avatarFile, setAvatarFile] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const savedAddresses = user?.addresses || [];

  const tabs = useMemo(
    () => [
      { key: "profile", label: "Profile", icon: FiUser },
      { key: "orders", label: "Orders", icon: FiPackage },
      { key: "refunds", label: "Refunds", icon: FiRefreshCw },
      { key: "inbox", label: "Inbox", icon: FiMail },
      { key: "track", label: "Track Order", icon: FiTruck },
      { key: "payments", label: "Change Password", icon: FiLock },
      { key: "address", label: "Address", icon: FiMapPin },
      { key: "wishlist", label: "Wishlist", icon: FiHeart },
      { key: "logout", label: "Log out", icon: FiLogOut },
    ],
    []
  );

  const handleChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePasswordFieldChange = (event) =>
    setPasswordForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  useEffect(() => {
    setProfile((current) => ({
      ...current,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      currentPassword: "",
    }));
    setAvatarPreview(toAbsoluteAssetUrl(user?.avatar || ""));
    setAvatarFile(null);
  }, [
    user?.avatar,
    user?.email,
    user?.name,
    user?.phoneNumber,
  ]);

  useEffect(() => {
    if (!successMessage && !profileUpdateError && !addressActionError) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch(clearUserFeedback());
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [addressActionError, dispatch, profileUpdateError, successMessage]);

  useEffect(() => {
    const nextTab = getValidProfileTab(searchParams.get("tab") || "");

    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [activeTab, searchParams]);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    dispatch(getUserOrders());
  }, [dispatch, user?._id]);

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phone);
    formData.append("currentPassword", profile.currentPassword);

    if (avatarFile) {
      formData.append("file", avatarFile);
    }

    const result = await dispatch(updateUserProfile(formData));

    if (result?.success) {
      setProfile((current) => ({
        ...current,
        currentPassword: "",
      }));
      setAvatarFile(null);
    }
  };

  const handlePasswordUpdate = async () => {
    const result = await dispatch(updateUserPassword(passwordForm));

    if (result?.success) {
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const refreshOrders = () => {
    dispatch(getUserOrders());
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

  const handleCreateAddress = async (addressData) => {
    const result = await dispatch(addUserAddress(addressData));
    return result;
  };

  const handleUpdateAddress = async (addressData) => {
    if (!editingAddress?._id) {
      return {
        success: false,
        message: "Address could not be updated.",
      };
    }

    const result = await dispatch(updateUserAddress(editingAddress._id, addressData));

    if (result?.success) {
      setEditingAddress(null);
    }

    return result;
  };

  const handleDeleteAddress = async (address) => {
    await dispatch(deleteUserAddress(address._id));
  };

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full p-[3px] bg-gradient-to-br from-emerald-300 to-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="h-full w-full rounded-full object-cover border border-[#0b0b0d]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full border border-[#0b0b0d] bg-[#0b0b0d] text-3xl font-semibold text-emerald-200">
                    {(profile.name || user?.name || "U").trim().charAt(0).toUpperCase() || "U"}
                  </div>
                )}
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
                <label className="text-xs text-white/40">Current Password</label>
                <input
                  name="currentPassword"
                  type="password"
                  value={profile.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter password to save changes"
                  className={inputClass}
                />
              </div>
            </div>

            {profileUpdateError ? (
              <p className="text-sm text-rose-300">{profileUpdateError}</p>
            ) : null}
            {!profileUpdateError && successMessage && activeTab === "profile" ? (
              <p className="text-sm text-emerald-300">{successMessage}</p>
            ) : null}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={profileUpdateLoading}
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
              >
                {profileUpdateLoading ? "Updating..." : "Update"}
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
            <div className="flex items-center gap-3">
              <button
                onClick={refreshOrders}
                disabled={userOrdersLoading}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRefreshCw className={`text-sm ${userOrdersLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <span className="text-xs text-white/40">
                {userOrdersLoading ? "Loading..." : `${userOrders.length} orders`}
              </span>
            </div>
          </div>

          {userOrdersError ? <p className="text-sm text-rose-300">{userOrdersError}</p> : null}

          {userOrdersLoading ? (
            <div className="rounded-xl border border-white/10 bg-[#0f0f12] px-4 py-5 text-sm text-white/55">
              Loading your latest orders...
            </div>
          ) : !userOrders.length ? (
            <div className="rounded-xl border border-white/10 bg-[#0f0f12] px-4 py-5 text-sm text-white/55">
              No orders yet. Your placed orders, including cash on delivery orders, will appear here.
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-white/10 bg-[#0f0f12] overflow-hidden">
                <div className="grid grid-cols-4 gap-3 px-4 py-3 text-[11px] uppercase tracking-widest text-white/30">
                  <span>Order ID</span>
                  <span>Status</span>
                  <span className="text-center">Items Qty</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-white/5">
                  {userOrders.map((order) => {
                    const style = getStatusStyle(order?.orderStatus);

                    return (
                      <Link
                        key={order._id}
                        to={`/profile/order/${order._id}`}
                        className={`grid w-full grid-cols-4 items-center gap-3 px-4 py-4 text-left transition hover:bg-white/5`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {formatOrderDisplayId(order._id)}
                          </p>
                          <p className="text-[11px] text-white/40">
                            {order?.shopName || "Shop"} · {formatReadableDate(order?.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.pill}`}>
                            {formatStatusLabel(order?.orderStatus)}
                          </span>
                        </div>
                        <p className="text-sm text-white text-center">{getOrderItemCount(order)}</p>
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-semibold text-white">
                            {formatOrderCurrency(order?.totalPrice)}
                          </span>
                          <FiArrowRight size={14} className="text-white/40" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    if (activeTab === "refunds") {
      const refundOrders = userOrders.filter((order) => order.status === "Processing refund" || order.status === "Refund Success" || order.refund?.requested);

      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Refunds</p>
              <h2 className="text-xl font-Playfair font-semibold text-white">Refund requests</h2>
            </div>
            <span className="text-xs text-white/40">{refundOrders.length} requests</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f0f12] overflow-hidden">
            <div className="grid grid-cols-4 gap-3 px-4 py-3 text-[11px] uppercase tracking-widest text-white/30">
              <span>Order ID</span>
              <span>Status</span>
              <span className="text-center">Items Qty</span>
              <span className="text-right">Total</span>
            </div>
            <div className="divide-y divide-white/5">
              {refundOrders.map((order) => {
                const style =
                  statusStyles[order.status] || {
                    pill: "bg-white/10 text-white border border-white/10",
                    dot: "bg-white/40",
                  };
                return (
                  <Link
                    key={order._id}
                    to={`/user/order/${order._id}`}
                    className="grid grid-cols-4 gap-3 px-4 py-4 text-sm transition hover:bg-white/5"
                  >
                    <span className="font-medium text-white">{order._id.slice(-8).toUpperCase()}</span>
                    <div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.pill}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-center text-white/50">{getOrderItemCount(order)}</span>
                    <span className="text-right font-semibold text-white">{formatOrderCurrency(order.totalPrice)}</span>
                  </Link>
                );
              })}
              {refundOrders.length === 0 && (
                <div className="px-4 py-12 text-center text-white/30">
                  No refund requests found.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "track") {
      const trackableOrders = userOrders.filter(
        (order) => String(order?.orderStatus || "").toLowerCase() !== "cancelled"
      );

      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Tracking</p>
              <h2 className="text-xl font-Playfair font-semibold text-white">Track orders</h2>
            </div>
            <span className="text-xs text-white/40">
              {userOrdersLoading ? "Loading..." : `${trackableOrders.length} shipments`}
            </span>
          </div>

          {userOrdersError ? <p className="text-sm text-rose-300">{userOrdersError}</p> : null}

          {userOrdersLoading ? (
            <div className="rounded-xl border border-white/10 bg-[#0f0f12] px-4 py-5 text-sm text-white/55">
              Loading shipment updates...
            </div>
          ) : !trackableOrders.length ? (
            <div className="rounded-xl border border-white/10 bg-[#0f0f12] px-4 py-5 text-sm text-white/55">
              No active orders to track yet.
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-white/10 bg-[#0f0f12] overflow-hidden">
                <div className="grid grid-cols-5 gap-3 px-4 py-3 text-[11px] uppercase tracking-widest text-white/30">
                  <span>Order ID</span>
                  <span>Shop</span>
                  <span>Status</span>
                  <span className="text-center">Items</span>
                  <span className="text-right">Updated</span>
                </div>
                <div className="divide-y divide-white/5">
                  {trackableOrders.map((order) => {
                    const style = getStatusStyle(order?.orderStatus);

                    return (
                      <Link
                        key={order._id}
                        to={`/profile/order/${order._id}`}
                        className={`grid w-full grid-cols-5 items-center gap-3 px-4 py-4 text-left transition hover:bg-white/5`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {formatOrderDisplayId(order._id)}
                          </p>
                          <p className="text-[11px] text-white/40">
                            {formatOrderCurrency(order?.totalPrice)}
                          </p>
                        </div>
                        <p className="text-sm text-white/70 truncate">{order?.shopName || "Shop"}</p>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.pill}`}>
                            {formatStatusLabel(order?.orderStatus)}
                          </span>
                        </div>
                        <p className="text-sm text-white text-center">{getOrderItemCount(order)}</p>
                        <div className="flex items-center justify-end gap-1 text-sm text-white">
                          <FiClock size={13} className="text-white/40" />
                          <span>{formatReadableDate(order?.updatedAt)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    if (activeTab === "payments") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 lg:p-8 space-y-5">
          <div className="space-y-2 text-left">
            <p className="text-[10px] uppercase tracking-widest text-white/30">Security</p>
            <h2 className="text-xl font-Playfair font-semibold text-white">Change Password</h2>
            <p className="text-sm text-white/45 max-w-2xl">
              Use your current password to confirm the update before saving a new one.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-white/40">Old Password</label>
              <input
                name="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordFieldChange}
                placeholder="Enter current password"
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40">New Password</label>
              <input
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordFieldChange}
                placeholder="Enter new password"
                className={inputClass}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-white/40">Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordFieldChange}
                placeholder="Enter new password again"
                className={inputClass}
              />
            </div>
          </div>

          {profileUpdateError ? (
            <p className="text-sm text-rose-300">{profileUpdateError}</p>
          ) : null}
          {!profileUpdateError && successMessage && activeTab === "payments" ? (
            <p className="text-sm text-emerald-300">{successMessage}</p>
          ) : null}

          <button
            type="button"
            onClick={handlePasswordUpdate}
            disabled={profileUpdateLoading}
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {profileUpdateLoading ? "Updating..." : "Update"}
          </button>

          <div className="hidden">
            {[].map((card) => (
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
                      <p className="text-sm font-semibold text-white">{card.label} · {card.last4}</p>
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
              <h2 className="text-xl font-Playfair font-semibold text-white">My addresses</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                dispatch(clearUserFeedback());
                setEditingAddress(null);
                setIsAddressModalOpen(true);
              }}
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b0b0d] transition hover:-translate-y-0.5"
            >
              Add New
            </button>
          </div>

          {addressActionError ? (
            <p className="text-sm text-rose-300">{addressActionError}</p>
          ) : null}
          {!addressActionError && successMessage && activeTab === "address" ? (
            <p className="text-sm text-emerald-300">{successMessage}</p>
          ) : null}

          {savedAddresses.length ? (
            <div className="space-y-3">
              {savedAddresses.map((address) => (
                <SavedAddressRow
                  key={address._id}
                  address={address}
                  onEdit={(selectedAddress) => {
                    dispatch(clearUserFeedback());
                    setEditingAddress(selectedAddress);
                    setIsAddressModalOpen(true);
                  }}
                  onDelete={handleDeleteAddress}
                  isDeleting={addressActionLoading && addressActionId === address._id}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#0f0f12] px-4 py-5 text-sm text-white/55">
              No saved addresses yet. Add one and it will appear here for profile and checkout.
            </div>
          )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-4">
              {wishlist.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "inbox") {
      return <Inbox isSeller={false} />;
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
      <div className="mx-auto max-w-6xl px-8 sm:px-12 pt-44 pb-28">
        <div className="grid gap-8 lg:grid-cols-4 pt-8">
          {/* Sidebar */}
          <div className="rounded-2xl border border-white/10 bg-[#111114] p-5">
            <ul className="space-y-2.5 text-base">
              {tabs.map(({ key, label, icon: Icon }) => (
                <li key={key}>
                  <button
                    onClick={() => {
                        if (key === "logout") {
                          handleLogout();
                        } else {
                          dispatch(clearUserFeedback());
                          if (key !== "address") {
                            setEditingAddress(null);
                          }
                          setActiveTab(key);
                          setSearchParams(
                            key === "profile" ? {} : { tab: key },
                            { replace: true }
                          );
                        }
                      }}
                    className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 transition ${
                      activeTab === key
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                      <span className="flex-shrink-0">
                        <Icon size={18} />
                      </span>
                      <span className="whitespace-nowrap">{label}</span>
                    </button>
                  </li>
              ))}
            </ul>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 pt-6">{renderContent()}</div>
        </div>
      </div>
      <AddressModal
        isOpen={isAddressModalOpen}
        isSubmitting={addressActionLoading}
        initialAddress={editingAddress}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSubmitAddress={editingAddress ? handleUpdateAddress : handleCreateAddress}
      />
      <Footer />
    </div>
  );
};

export default ProfilePage;
