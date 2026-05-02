import React, { useState, useEffect } from "react";
import { FiX, FiCheck, FiMail, FiPhone, FiLock, FiInfo, FiMapPin, FiBriefcase } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateSellerInfo, updateSellerPassword, updateShopBanner } from "../../../redux/actions/seller";

const EditSellerModal = ({ isOpen, onClose, seller }) => {
  const dispatch = useDispatch();
  const { currentSellerLoading, currentSellerError } = useSelector((state) => state.seller);

  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    shopName: seller?.shopName || "",
    email: seller?.email || "",
    phone: seller?.phone || "",
    address: seller?.address || "",
    description: seller?.description || "",
    zip: seller?.zip || "",
    banner: seller?.banner || "",
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (seller) {
      setFormData({
        shopName: seller.shopName || "",
        email: seller.email || "",
        phone: seller.phone || "",
        address: seller.address || "",
        description: seller.description || "",
        zip: seller.zip || "",
        banner: seller.banner || "",
      });
      setBannerPreview(null);
    }
  }, [seller]);

  if (!isOpen) return null;

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    setBannerFile(file);
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setBannerPreview(null);
    }
  };

  const handleInfoUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (bannerFile) {
      const result = await dispatch(updateShopBanner(bannerFile));
      if (result.success) {
        setFormData((f) => ({ ...f, banner: result.banner }));
        setMessage("Shop banner updated successfully!");
        setBannerFile(null);
        setBannerPreview(null);
      } else {
        setError(result.message);
      }
    }

    const result = await dispatch(updateSellerInfo(formData));
    if (result.success) {
      setMessage("Shop information updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setError(result.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await dispatch(updateSellerPassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    }));

    if (result.success) {
      setMessage("Password updated successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage(""), 3000);
    } else {
      setError(result.message);
    }
  };

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-300/30 focus:outline-none focus:ring-1 focus:ring-emerald-300/10 transition";
  const labelClass = "text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0b0b0d]/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[#111114] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-Playfair font-semibold text-white">Edit Shop Profile</h2>
            <p className="mt-1 text-sm text-white/40">Manage your store information and security</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition text-white/50 hover:text-white">
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold transition border-b-2 ${
              activeTab === "info" ? "border-emerald-300 text-emerald-300" : "border-transparent text-white/40 hover:text-white/60"
            }`}
          >
            <FiInfo size={16} /> Shop Info
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold transition border-b-2 ${
              activeTab === "password" ? "border-emerald-300 text-emerald-300" : "border-transparent text-white/40 hover:text-white/60"
            }`}
          >
            <FiLock size={16} /> Security
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {message && (
            <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3 text-emerald-300 text-sm animate-in fade-in slide-in-from-top-2">
              <FiCheck size={18} /> {message}
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {activeTab === "info" ? (
            <form onSubmit={handleInfoUpdate} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Shop Name</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-4 top-3.5 text-white/20" size={16} />
                    <input
                      type="text"
                      className={`${inputClass} pl-11`}
                      value={formData.shopName}
                      onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-3.5 text-white/20" size={16} />
                    <input
                      type="email"
                      className={`${inputClass} pl-11`}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-3.5 text-white/20" size={16} />
                    <input
                      type="text"
                      className={`${inputClass} pl-11`}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Zip Code</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-3.5 text-white/20" size={16} />
                    <input
                      type="text"
                      className={`${inputClass} pl-11`}
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Shop Address</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full shop address..."
                />
              </div>

<div>
                 <label className={labelClass}>Shop Description</label>
                 <textarea
                   className={`${inputClass} h-32 resize-none`}
                   value={formData.description}
                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                   placeholder="Tell customers about your shop..."
                 />
               </div>

               <div>
                 <label className={labelClass}>Shop Banner</label>
                 {(formData.banner || bannerPreview) && (
                   <div className="mb-3 rounded-xl border border-white/10 bg-[#0b0b0d] p-3">
                     <img
                       src={bannerPreview || formData.banner}
                       alt="banner preview"
                       className="w-full h-32 rounded-lg object-cover border border-white/10"
                     />
                   </div>
                 )}
                 <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-purple-300/40 bg-purple-300/5 px-4 py-3 text-xs text-white/70 hover:border-purple-300/70 transition">
                   <div>
                     <p className="font-semibold text-white text-sm">Upload banner</p>
                     <p className="text-[11px] text-white/40">Recommended: 1200x400px</p>
                   </div>
                   <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white">Browse</div>
                   <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                 </label>
               </div>

               <button
                type="submit"
                disabled={currentSellerLoading}
                className="w-full rounded-2xl bg-emerald-300 py-4 text-sm font-bold uppercase tracking-widest text-[#0b0b0d] transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-50"
              >
                {currentSellerLoading ? "Updating..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label className={labelClass}>Current Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 text-white/20" size={16} />
                  <input
                    type="password"
                    className={`${inputClass} pl-11`}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={labelClass}>New Password</label>
                  <input
                    type="password"
                    className={inputClass}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <input
                    type="password"
                    className={inputClass}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={currentSellerLoading}
                className="w-full rounded-2xl bg-white py-4 text-sm font-bold uppercase tracking-widest text-[#0b0b0d] transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-50"
              >
                {currentSellerLoading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSellerModal;
