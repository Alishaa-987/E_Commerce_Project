import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-[120px] animate-glow" />
        <div className="pointer-events-none absolute right-0 top-16 h-40 w-40 rounded-full bg-emerald-300/10 blur-[90px] animate-glow" />
        <div className="pointer-events-none absolute left-10 top-24 hidden h-24 w-24 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md lg:block animate-float" />

        <div className="mx-auto max-w-6xl px-6 py-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-white/70">
                Lumen Market
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link to="/login" className="text-white/60 hover:text-white">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/60"
              >
                Sign up
              </Link>
            </div>
          </nav>

          <div className="flex min-h-[72vh] flex-col items-center justify-center gap-10 py-16 text-center lg:flex-row lg:items-center lg:text-left">
            <div className="space-y-6 lg:flex-1">
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-emerald-200/80">
                Premium essentials
                <span className="h-1 w-1 rounded-full bg-emerald-300" />
              </span>

              <h1 className="text-4xl font-Playfair font-semibold leading-tight md:text-5xl">
                Sell-worthy products, presented with quiet confidence.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-white/70 md:text-lg lg:mx-0">
                A modern storefront for elevated essentials. Clear product
                stories, minimal distractions, and a buying flow built for
                conversion.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  to="/signup"
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] shadow-lg transition hover:-translate-y-0.5"
                >
                  Start selling
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  I already have an account
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/50 lg:justify-start">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Verified quality
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  Fast fulfillment
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  Premium packaging
                </span>
              </div>
            </div>

            <div className="relative w-full max-w-md animate-fade-up lg:translate-y-2">
              <div className="absolute -inset-4 rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.6)]" />
              <div className="relative rounded-[28px] border border-white/10 bg-[#111114] p-6">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/40">
                  Featured
                  <span>01</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5">
                    <p className="text-sm text-white/60">Best seller</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Atelier Leather Tote
                    </p>
                    <p className="mt-2 text-xs text-white/50">
                      Crafted full-grain leather. Limited run.
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                      <span>$219</span>
                      <span>Only 12 left</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">
                    <span>Minimal Ceramic Set</span>
                    <span>$68</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">
                    <span>Studio Wool Throw</span>
                    <span>$124</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
