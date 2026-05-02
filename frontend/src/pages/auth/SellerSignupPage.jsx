import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { server } from "../../server";

const input =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition";

const SellerSignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shopName: "",
    email: "",
    phone: "",
    zip: "",
    password: "",
    avatar: null,
    banner: null,
  });
  const [preview, setPreview] = useState({ avatar: null, banner: null });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setForm((f) => ({ ...f, avatar: file }));
    if (file) {
      setPreview((p) => ({ ...p, avatar: URL.createObjectURL(file) }));
    } else {
      setPreview((p) => ({ ...p, avatar: null }));
    }
  };

  const handleBanner = (e) => {
    const file = e.target.files?.[0];
    setForm((f) => ({ ...f, banner: file }));
    if (file) {
      setPreview((p) => ({ ...p, banner: URL.createObjectURL(file) }));
    } else {
      setPreview((p) => ({ ...p, banner: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("shopName", form.shopName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("zip", form.zip);
      formData.append("password", form.password);
      if (form.avatar) formData.append("file", form.avatar);
      if (form.banner) formData.append("banner", form.banner);

      const { data } = await axios.post(`${server}/seller/create-seller`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(data.message || "Activation email sent. Please check your inbox.");
      setTimeout(() => navigate("/seller-login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-16">
        <div className="rounded-3xl border border-white/10 bg-[#111114] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-Playfair font-semibold">Become a Seller</h1>
            <p className="text-white/50 text-sm mt-1">
              Create your shop account to start selling.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Shop Name</label>
                <input
                  name="shopName"
                  value={form.shopName}
                  onChange={handleChange}
                  className={input}
                  placeholder="My Awesome Shop"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={input}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={input}
                  placeholder="+92 300 0000000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/50">Zip Code</label>
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  className={input}
                  placeholder="74000"
                />
              </div>
            </div>
<div className="grid gap-4 sm:grid-cols-2">
               <div className="space-y-1.5">
                 <label className="text-xs text-white/50">Password</label>
                 <input
                   name="password"
                   type="password"
                   value={form.password}
                   onChange={handleChange}
                   className={input}
                   placeholder="********"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-xs text-white/50">Shop Logo</label>
                 <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-emerald-300/40 bg-emerald-300/5 px-4 py-3 text-xs text-white/70 hover:border-emerald-300/70 transition">
                   <div>
                     <p className="font-semibold text-white text-sm">Upload logo</p>
                     <p className="text-[11px] text-white/40">PNG or JPG, max 2MB</p>
                   </div>
                   <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white">Browse</div>
                   <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                 </label>
                 {preview.avatar && (
                   <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b0d] p-3">
                     <img src={preview.avatar} alt="preview" className="h-12 w-12 rounded-lg object-cover border border-white/10" />
                     <span className="text-xs text-white/60 truncate">{form.avatar?.name}</span>
                   </div>
                 )}
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-xs text-white/50">Shop Banner (Optional)</label>
               <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-purple-300/40 bg-purple-300/5 px-4 py-3 text-xs text-white/70 hover:border-purple-300/70 transition">
                 <div>
                   <p className="font-semibold text-white text-sm">Upload banner</p>
                   <p className="text-[11px] text-white/40">Recommended: 1200x400px</p>
                 </div>
                 <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white">Browse</div>
                 <input type="file" accept="image/*" onChange={handleBanner} className="hidden" />
               </label>
               {preview.banner && (
                 <div className="rounded-xl border border-white/10 bg-[#0b0b0d] p-3">
                   <img src={preview.banner} alt="banner preview" className="w-full h-32 rounded-lg object-cover border border-white/10" />
                   <span className="mt-2 block text-xs text-white/60 truncate">{form.banner?.name}</span>
                 </div>
               )}
             </div>
             {error && <p className="text-sm text-rose-300">{error}</p>}
            {message && <p className="text-sm text-emerald-300">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Register as Seller"}
            </button>
            <p className="text-center text-xs text-white/50">
              Already a seller?{" "}
              <Link to="/seller-login" className="text-emerald-200 hover:text-white">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerSignupPage;
