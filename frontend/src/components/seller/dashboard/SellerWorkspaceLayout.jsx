import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearSellerSession } from "../sellerSession";
import {
  getSellerActiveNavKey,
  getSellerDashboardData,
} from "../sellerWorkspace";
import SellerDashboardHeader from "./SellerDashboardHeader";
import SellerDashboardSidebar from "./SellerDashboardSidebar";

const SellerWorkspaceLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(() =>
    getSellerDashboardData(6)
  );

  const { storedEmail, sellerShop, sellerAvatar } = dashboardData;
  const activeSection = getSellerActiveNavKey(location.pathname);

  const handleLogout = () => {
    clearSellerSession();
    navigate("/seller-login", { replace: true });
  };

  const refreshDashboardData = () => {
    setDashboardData(getSellerDashboardData(6));
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-12 top-0 h-72 w-72 rounded-full bg-emerald-300/12 blur-[160px]" />
        <div className="absolute left-[-5rem] top-1/3 h-64 w-64 rounded-full bg-white/5 blur-[150px]" />
      </div>

      <div className="relative flex min-h-screen">
        <SellerDashboardSidebar
          sellerShop={sellerShop}
          sellerAvatar={sellerAvatar}
          storedEmail={storedEmail}
          activeSection={activeSection}
        />

        <div className="flex-1">
          <SellerDashboardHeader
            sellerShop={sellerShop}
            sellerAvatar={sellerAvatar}
            activeSection={activeSection}
            onLogout={handleLogout}
          />

          <main className="px-5 pb-10 pt-6 lg:px-8">
            <Outlet context={{ dashboardData, refreshDashboardData }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerWorkspaceLayout;
