import React from "react";

const SellerPageLoader = ({
  label = "Loading seller workspace",
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen
          ? "min-h-screen bg-[#0b0b0d]"
          : "min-h-[420px] rounded-[28px] border border-white/10 bg-[#111114]"
      }`}
    >
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border border-white/10 bg-white/5" />
          <div className="absolute h-16 w-16 rounded-full border-2 border-transparent border-t-emerald-300 border-r-emerald-200/40 animate-spin" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.38em] text-white/35">
            Seller Area
          </p>
          <p className="mt-2 text-sm text-white/60">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerPageLoader;
