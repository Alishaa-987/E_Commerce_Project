import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiClock } from "react-icons/fi";
import { getSellerNavPath } from "../sellerWorkspace";

const SellerDashboardHealthCard = () => {
  return (
    <div className="rounded-[32px] border border-white/10 bg-[#111114] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.45)] lg:p-7">
      <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">
        Today at a glance
      </p>
      <h2 className="mt-2 text-2xl font-Playfair font-semibold text-white">
        Store health
      </h2>

      <div className="mt-6 space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/50">Response time</p>
              <p className="mt-2 text-xl font-semibold text-white">
                22 minutes
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300">
              <FiClock size={16} />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-white/55">
            <span>Dispatch target</span>
            <span className="font-semibold text-white">96%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div className="h-2 w-[96%] rounded-full bg-emerald-300" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-white/55">
            <span>Store conversion</span>
            <span className="font-semibold text-white">4.8%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div className="h-2 w-[61%] rounded-full bg-white" />
          </div>
        </div>

        <Link
          to={getSellerNavPath("createProduct")}
          className="flex w-full items-center justify-between rounded-[26px] border border-emerald-300/15 bg-emerald-300/8 px-5 py-4 text-left transition hover:border-emerald-300/25"
        >
          <div>
            <p className="text-sm text-white/60">Quick action</p>
            <p className="mt-1 text-lg font-semibold text-white">
              Create your next listing
            </p>
          </div>
          <FiArrowRight size={18} className="text-emerald-300" />
        </Link>
      </div>
    </div>
  );
};

export default SellerDashboardHealthCard;
