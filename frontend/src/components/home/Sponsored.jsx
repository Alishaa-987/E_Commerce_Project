import React from "react";
import { brandNames } from "../../data/mockData";

const Sponsored = () => {
  // Duplicate for seamless loop
  const loopBrands = [...brandNames, ...brandNames];

  return (
    <section className="py-12 border-y border-white/5 overflow-hidden bg-[#0b0b0d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-6">
        <p className="text-center text-[10px] uppercase tracking-widest text-white/25">
          Trusted by top brands
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#0b0b0d] to-transparent z-10" />
<div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#0b0b0d] to-transparent z-10" />

        {/* Marquee */}
        <div className="flex" style={{ animation: "marquee 22s linear infinite" }}>
          {loopBrands.map((brand, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2 mx-8"
            >
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="whitespace-nowrap text-sm font-medium text-white/25 hover:text-white/50 transition cursor-default">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsored;

