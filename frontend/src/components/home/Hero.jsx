import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { useSelector } from "react-redux";

const Hero = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allShops } = useSelector((state) => state.seller);
  const { allEvents } = useSelector((state) => state.events);
  const rankedProducts = useMemo(
    () =>
      [...allProducts].sort((a, b) => {
        if (Number(b.sold || 0) !== Number(a.sold || 0)) {
          return Number(b.sold || 0) - Number(a.sold || 0);
        }

        if (Number(b.rating || 0) !== Number(a.rating || 0)) {
          return Number(b.rating || 0) - Number(a.rating || 0);
        }

        return Number(b.price || 0) - Number(a.price || 0);
      }),
    [allProducts]
  );
  const heroProduct = rankedProducts[0] || null;
  const miniProducts = rankedProducts.slice(1, 4);
  const liveEvents = allEvents.filter((event) => event.status === "Live").length;
  const marketplaceSummary =
    allProducts.length || allShops.length
      ? `${allProducts.length} live products across ${allShops.length} active shops.`
      : "A storefront ready for real products, real sellers, and live campaigns.";

  return (
    <section className="relative isolate min-h-[600px] overflow-hidden pb-16 pt-32">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-[140px] animate-glow" />
      <div className="pointer-events-none absolute right-0 top-16 h-60 w-60 translate-x-1/3 rounded-full bg-white/5 blur-[100px] animate-glow" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-center lg:gap-16">
          <div className="space-y-7 text-center lg:flex-1 lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-emerald-200/80 backdrop-blur">
              <span className="h-1 w-1 rounded-full bg-emerald-300" />
              Premium multi-vendor marketplace
            </span>

            <h1 className="text-4xl font-Playfair font-semibold leading-tight text-white sm:text-5xl xl:text-6xl">
              Sell-worthy products,{" "}
              <span className="text-white/60">presented with</span>{" "}
              quiet confidence.
            </h1>

            <p className="mx-auto max-w-xl text-base text-white/60 lg:mx-0 lg:text-lg">
              {marketplaceSummary} Clear product stories, minimal distractions, and a buying flow built for conversion.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                to="/products"
                className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] shadow-lg transition hover:-translate-y-0.5"
              >
                Explore Products
                <FiArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/become-seller"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Start Selling
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/40 lg:justify-start">
              {[
                `${allProducts.length} Live Products`,
                `${allShops.length} Active Shops`,
                `${liveEvents} Live Events`,
              ].map((label, i) => (
                <span key={label} className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === 0
                        ? "bg-emerald-300"
                        : i === 1
                          ? "bg-white/50"
                          : "bg-white/30"
                    }`}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative w-full max-w-md animate-fade-up lg:max-w-lg">
            <div className="relative rounded-[28px] border border-white/10 bg-[#111114] p-7">
              <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/30">
                <span>Featured this week</span>
                <span>
                  {heroProduct
                    ? `01/${String(Math.min(rankedProducts.length, 4)).padStart(2, "0")}`
                    : "00/00"}
                </span>
              </div>

              {heroProduct ? (
                <>
                  <Link to={`/product/${heroProduct.id}`}>
                    <div className="group mb-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5 transition hover:border-white/20">
                      <div className="flex items-start gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#18181b] p-1">
                          <img
                            src={heroProduct.image}
                            alt={heroProduct.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-emerald-300">
                            {heroProduct.isBestSeller ? "Best seller" : "Featured"}
                          </span>
                          <p className="mt-0.5 text-base font-semibold text-white">
                            {heroProduct.name}
                          </p>
                          <p className="mt-1 text-xs text-white/40">
                            {heroProduct.shopName}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-base font-semibold text-white">
                              ${heroProduct.price}
                            </span>
                            {heroProduct.originalPrice ? (
                              <span className="text-sm text-white/30 line-through">
                                ${heroProduct.originalPrice}
                              </span>
                            ) : null}
                            <span className="flex items-center gap-0.5 text-[10px] text-emerald-300">
                              <AiFillStar size={10} /> {heroProduct.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {miniProducts.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="mb-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
                    >
                      <span>{item.name}</span>
                      <span className="font-medium text-white/80">${item.price}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6 text-center">
                  <p className="text-lg font-semibold text-white">No products published yet</p>
                  <p className="mt-2 text-sm text-white/45">
                    Once products are created in the backend, the top listing will appear here automatically.
                  </p>
                  <Link
                    to="/become-seller"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
                  >
                    Create a seller shop <FiArrowRight size={14} />
                  </Link>
                </div>
              )}

              <Link
                to="/products"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-[11px] font-medium uppercase tracking-wider text-white/50 transition hover:border-white/30 hover:text-white"
              >
                View all products <FiArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
