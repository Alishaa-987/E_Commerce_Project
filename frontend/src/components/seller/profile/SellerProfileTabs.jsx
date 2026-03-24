import React from "react";

const SellerProfileTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
            activeTab === tab.key
              ? "border border-emerald-300/20 bg-emerald-300/12 text-emerald-200"
              : "border border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SellerProfileTabs;
