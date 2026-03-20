import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { server } from "../../server";

const input =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition";

const SellerLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${server}/seller/login-seller`,
        { email: form.email, password: form.password },
        { withCredentials: true }
      );
      localStorage.setItem("sellerAuth", "true");
      navigate("/seller/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />
      <div className="mx-auto max-w-md px-6 pt-24 pb-16">
        <div className="rounded-3xl border border-white/10 bg-[#111114] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-Playfair font-semibold">Seller Login</h1>
            <p className="text-white/50 text-sm mt-1">Access your seller dashboard.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
            <p className="text-center text-xs text-white/50">
              New seller?{" "}
              <Link to="/become-seller" className="text-emerald-200 hover:text-white">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerLoginPage;
