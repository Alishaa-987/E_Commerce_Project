import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const SellerDashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="rounded-3xl border border-white/10 bg-[#111114] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Seller area</p>
          <h1 className="text-3xl font-Playfair font-semibold mb-3">Welcome, seller!</h1>
          <p className="text-white/60 text-sm">
            Your dashboard will live here. You are signed in with your seller account.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboardPage;
