import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerDashboardHero from "../../components/seller/dashboard/SellerDashboardHero";
import SellerDashboardOverviewPanel from "../../components/seller/dashboard/SellerDashboardOverviewPanel";

const SellerDashboardPage = () => {
  const { dashboardData } = useOutletContext();

  const {
    sellerShop,
    sellerProductCount,
    sellerAvatar,
    runningEvents,
    overviewCards,
    averageRating,
    shopMeta,
  } = dashboardData;

  return (
    <div className="space-y-6">
      <SellerDashboardHero
        sellerShop={sellerShop}
        sellerAvatar={sellerAvatar}
        averageRating={averageRating}
        sellerProductCount={sellerProductCount}
        runningEventCount={runningEvents.length}
        shopMeta={shopMeta}
      />

      <SellerDashboardOverviewPanel
        overviewCards={overviewCards}
        runningEvents={runningEvents}
        sellerShop={sellerShop}
        shopMeta={shopMeta}
      />
    </div>
  );
};

export default SellerDashboardPage;
