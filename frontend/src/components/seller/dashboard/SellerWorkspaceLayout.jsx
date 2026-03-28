import React, { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSellerSession } from "../sellerSession";
import {
  getSellerActiveNavKey,
  getSellerDashboardData,
} from "../sellerWorkspace";
import SellerPageLoader from "../SellerPageLoader";
import SellerDashboardHeader from "./SellerDashboardHeader";
import SellerDashboardSidebar from "./SellerDashboardSidebar";
import { loadSellerById } from "../../../redux/actions/seller";
import { getAllProductsShop } from "../../../redux/actions/product";
import { getAllEventsShop } from "../../../redux/actions/event";

const SellerWorkspaceLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sellerId =
    typeof window !== "undefined" ? window.localStorage.getItem("sellerId") : null;
  const storedSellerEmail =
    typeof window !== "undefined" ? window.localStorage.getItem("sellerEmail") || "" : "";
  const {
    currentSeller,
    currentSellerLoading,
    currentSellerError,
  } = useSelector((state) => state.seller);
  const { sellerProducts, sellerProductsLoading } = useSelector((state) => state.products);
  const { sellerEvents, sellerEventsLoading } = useSelector((state) => state.events);
  const dashboardData = useMemo(
    () =>
      getSellerDashboardData({
        sellerShop: currentSeller,
        sellerProducts,
        sellerEvents,
        storedEmail: storedSellerEmail,
        sellerAvatar: currentSeller?.avatar,
      }),
    [currentSeller, sellerProducts, sellerEvents, storedSellerEmail]
  );

  const { storedEmail, sellerShop, sellerAvatar } = dashboardData;
  const activeSection = getSellerActiveNavKey(location.pathname);

  useEffect(() => {
    if (!sellerId) {
      return;
    }

    dispatch(loadSellerById(sellerId));
    dispatch(getAllProductsShop(sellerId));
    dispatch(getAllEventsShop(sellerId));
  }, [dispatch, sellerId]);

  useEffect(() => {
    if (!sellerId || currentSeller || !currentSellerError) {
      return;
    }

    const normalizedError = currentSellerError.toLowerCase();
    if (
      normalizedError.includes("seller not found") ||
      normalizedError.includes("cast to objectid failed")
    ) {
      clearSellerSession();
      navigate("/seller-login", { replace: true });
    }
  }, [currentSeller, currentSellerError, navigate, sellerId]);

  const handleLogout = () => {
    clearSellerSession();
    navigate("/seller-login", { replace: true });
  };

  const refreshDashboardData = () => {
    if (!sellerId) {
      return;
    }

    dispatch(loadSellerById(sellerId));
    dispatch(getAllProductsShop(sellerId));
    dispatch(getAllEventsShop(sellerId));
  };

  if (!sellerId) {
    clearSellerSession();
    return <Navigate to="/seller-login" replace />;
  }

  if (!currentSeller && !currentSellerError) {
    return <SellerPageLoader label="Opening seller workspace" />;
  }

  if ((currentSellerLoading && !currentSeller) || sellerProductsLoading || sellerEventsLoading) {
    return <SellerPageLoader label="Opening seller workspace" />;
  }

  if (!sellerShop || currentSellerError) {
    return <SellerPageLoader label={currentSellerError || "Loading seller workspace"} />;
  }

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
