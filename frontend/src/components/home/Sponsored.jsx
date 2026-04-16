import React from "react";
import { useSelector } from "react-redux";

const Sponsored = () => {
  const { allShops, allShopsLoading } = useSelector((state) => state.seller);
  const brandNames = allShops
    .map((shop) => shop.name)
    .filter(Boolean)
    .slice(0, 8);
  const loopBrands = [...brandNames, ...brandNames];

  return (
    <section className="py-16 border-y border-white/5 overflow-hidden bg-[#0b0b0d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-xs uppercase tracking-widest text-white/25">
          Active sellers on the marketplace
        </p>
      </div>

      {allShopsLoading ? (
        <div className="px-6 text-center text-base text-white/40">Loading shops...</div>
      ) : brandNames.length ? (
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#0b0b0d] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#0b0b0d] to-transparent" />

          <div className="flex" style={{ animation: "marquee 22s linear infinite" }}>
            {loopBrands.map((brand, i) => (
              <div key={`${brand}-${i}`} className="mx-10 flex shrink-0 items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="cursor-default whitespace-nowrap text-base font-medium text-white/25 transition hover:text-white/50">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6 text-center text-base text-white/40">
          Seller names from the backend will appear here once shops are created.
        </div>
      )}
    </section>
  );
};

export default Sponsored;
