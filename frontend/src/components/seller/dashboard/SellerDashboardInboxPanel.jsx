import React from "react";

const SellerDashboardInboxPanel = ({ inboxThreads }) => {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:p-7">
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
          Shop Inbox
        </p>
        <h2 className="mt-2 text-2xl font-Playfair font-semibold">
          Buyer conversations
        </h2>
      </div>
      <div className="space-y-3">
        {inboxThreads.map((thread) => (
          <div
            key={thread.name}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">{thread.name}</p>
              <span className="text-xs text-white/35">{thread.time}</span>
            </div>
            <p className="mt-2 text-sm text-white/70">{thread.subject}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboardInboxPanel;
