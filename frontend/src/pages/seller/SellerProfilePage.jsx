import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import SellerPageLoader from "../../components/seller/SellerPageLoader";
import {
  getSellerAverageRating,
  getSellerWorkspaceData,
  sellerProfileTabs,
} from "../../components/seller/sellerWorkspace";
import { clearSellerSession } from "../../components/seller/sellerSession";
import useSellerViewLoader from "../../components/seller/useSellerViewLoader";
import SellerProfileEventsTab from "../../components/seller/profile/SellerProfileEventsTab";
import SellerProfileProductsTab from "../../components/seller/profile/SellerProfileProductsTab";
import SellerProfileReviewsTab from "../../components/seller/profile/SellerProfileReviewsTab";
import SellerProfileSidebar from "../../components/seller/profile/SellerProfileSidebar";
import SellerProfileTabs from "../../components/seller/profile/SellerProfileTabs";

const SellerProfilePage = () => {
  const navigate = useNavigate();
  const profileData = useMemo(() => getSellerWorkspaceData(8), []);
  const { activeKey, isLoading, changeView } = useSellerViewLoader("products", 280);

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
            onEditShop={() => navigate("/seller/dashboard")}
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
                  onTabChange={changeView}
                />
              </div>
            </div>

            {isLoading ? (
              <SellerPageLoader fullScreen={false} label="Loading shop details" />
            ) : activeKey === "events" ? (
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
    </div>
  );
};

export default SellerProfilePage;
