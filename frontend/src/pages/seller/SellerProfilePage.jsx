import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import SellerPageLoader from "../../components/seller/SellerPageLoader";
import {
  getSellerAverageRating,
  getSellerWorkspaceData,
  sellerProfileTabs,
} from "../../components/seller/sellerWorkspace";
import { clearSellerSession } from "../../components/seller/sellerSession";
import SellerProfileEventsTab from "../../components/seller/profile/SellerProfileEventsTab";
import SellerProfileProductsTab from "../../components/seller/profile/SellerProfileProductsTab";
import SellerProfileReviewsTab from "../../components/seller/profile/SellerProfileReviewsTab";
import SellerProfileSidebar from "../../components/seller/profile/SellerProfileSidebar";
import SellerProfileTabs from "../../components/seller/profile/SellerProfileTabs";
import EditSellerModal from "../../components/seller/profile/EditSellerModal";
import { loadSellerById } from "../../redux/actions/seller";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";

const SellerProfilePage = () => {
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
  const { sellerProducts: sellerProductsState, sellerProductsLoading } = useSelector(
    (state) => state.products
  );
  const { sellerEvents, sellerEventsLoading } = useSelector((state) => state.events);
  const profileData = useMemo(
    () =>
      getSellerWorkspaceData({
        sellerShop: currentSeller,
        sellerProducts: sellerProductsState,
        sellerEvents,
        storedEmail: storedSellerEmail,
        sellerAvatar: currentSeller?.avatar,
      }),
    [currentSeller, sellerProductsState, sellerEvents, storedSellerEmail]
  );
  const [activeKey, setActiveKey] = useState("products");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const {
    storedEmail,
    sellerShop,
    sellerProducts,
    sellerProductCount,
    sellerAvatar,
    shopMeta,
    runningEvents,
    shopReviews,
  } = profileData;

  const averageRating = getSellerAverageRating(shopReviews, sellerShop.rating);

  const handleLogout = () => {
    clearSellerSession();
    navigate("/seller-login", { replace: true });
  };

  if (!sellerId) {
    clearSellerSession();
    return <Navigate to="/seller-login" replace />;
  }

  if (!currentSeller && !currentSellerError) {
    return <SellerPageLoader label="Loading shop details" />;
  }

  if (
    (currentSellerLoading && !currentSeller) ||
    sellerProductsLoading ||
    sellerEventsLoading
  ) {
    return <SellerPageLoader label="Loading shop details" />;
  }

  if (!sellerShop || currentSellerError) {
    return <SellerPageLoader label={currentSellerError || "Loading shop details"} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-4rem] top-0 h-72 w-72 rounded-full bg-emerald-300/10 blur-[170px]" />
        <div className="absolute left-[-5rem] bottom-0 h-72 w-72 rounded-full bg-white/5 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-5 py-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/seller/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/25 hover:text-white"
          >
            <FiArrowLeft size={14} />
            Seller Dashboard
          </Link>
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0b0d] transition hover:-translate-y-0.5"
          >
            Go Dashboard
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <SellerProfileSidebar
            sellerShop={sellerShop}
            sellerAvatar={sellerAvatar}
            storedEmail={storedEmail}
            shopMeta={shopMeta}
            sellerProductCount={sellerProductCount}
            averageRating={averageRating}
            onEditShop={() => setIsEditModalOpen(true)}
            onLogout={handleLogout}
          />

          <section className="space-y-5">
            <div className="rounded-[30px] border border-white/10 bg-[#111114] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:px-7">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">
                    Seller Profile
                  </p>
                  <h2 className="mt-2 text-3xl font-Playfair font-semibold text-white">
                    Shop info and storefront activity
                  </h2>
                </div>
                <SellerProfileTabs
                  tabs={sellerProfileTabs}
                  activeTab={activeKey}
                  onTabChange={setActiveKey}
                />
              </div>
            </div>

            {activeKey === "events" ? (
              <SellerProfileEventsTab runningEvents={runningEvents} />
            ) : activeKey === "reviews" ? (
              <SellerProfileReviewsTab
                shopReviews={shopReviews}
                averageRating={averageRating}
              />
            ) : (
              <SellerProfileProductsTab
                sellerProducts={sellerProducts}
                sellerProductCount={sellerProductCount}
                averageRating={averageRating}
                sellerShop={sellerShop}
              />
            )}
          </section>
        </div>
      </div>
      <EditSellerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        seller={sellerShop}
      />
    </div>
  );
};

export default SellerProfilePage;
