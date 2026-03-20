import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 min-h-[600px]">
      {/* Orbs */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-[140px] animate-glow" />
      <div className="pointer-events-none absolute right-0 top-16 h-60 w-60 translate-x-1/3 rounded-full bg-white/5 blur-[100px] animate-glow" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: Copy */}
          <div className="space-y-7 lg:flex-1 text-center lg:text-left">
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
              A curated storefront for elevated essentials. Clear product stories, minimal distractions, and a buying flow built for conversion.
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
                to="/signup"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Start Selling
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/40 lg:justify-start">
              {["Verified Quality", "Fast Fulfillment", "Premium Packaging"].map(
                (label, i) => (
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
                )
              )}
            </div>
          </div>

          {/* Right: Featured card */}
          <div className="relative w-full max-w-md lg:max-w-lg animate-fade-up">
            <div className="relative rounded-[28px] border border-white/10 bg-[#111114] p-7">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/30 mb-5">
                <span>Featured this week</span>
                <span>01/03</span>
              </div>

              {/* Hero product */}
              <Link to="/product/1">
                <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5 mb-3 hover:border-white/20 transition">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0 bg-[#18181b] p-1">
                      <img
                        src="https://images.pexels.com/photos/27204286/pexels-photo-27204286.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop"
                        alt="Atelier Leather Tote"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-emerald-300">Best seller</span>
                      <p className="mt-0.5 text-base font-semibold text-white">Atelier Leather Tote</p>
                      <p className="mt-1 text-xs text-white/40">Full-grain leather | Limited run</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-base font-semibold text-white">$219</span>
                        <span className="text-sm text-white/30 line-through">$299</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-300">
                          <AiFillStar size={10} /> 4.8
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Mini list */}
              {[
                { name: "Minimal Ceramic Set", price: "$68", to: "/product/2" },
                { name: "Studio Wool Throw", price: "$124", to: "/product/3" },
                { name: "Glow Skincare Set", price: "$89", to: "/product/4" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/60 hover:text-white hover:border-white/20 transition mb-2"
                >
                  <span>{item.name}</span>
                  <span className="font-medium text-white/80">{item.price}</span>
                </Link>
              ))}

              <Link
                to="/products"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-[11px] font-medium uppercase tracking-wider text-white/50 hover:text-white hover:border-white/30 transition"
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


