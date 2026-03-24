import React from "react";
import { Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";

const SellerDashboardWorkspacePanel = ({ sectionTitle, description }) => {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:p-7">
      <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
        Workspace
      </p>
      <h2 className="mt-2 text-2xl font-Playfair font-semibold">
        {sectionTitle}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/seller/dashboard"
          className="rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#0b0b0d] transition hover:-translate-y-0.5"
        >
          Back to dashboard
        </Link>
        <Link
          to="/seller/profile"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70 transition hover:border-white/25 hover:text-white"
        >
          Open shop profile <FiExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};

export default SellerDashboardWorkspacePanel;
