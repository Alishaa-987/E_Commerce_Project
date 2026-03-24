import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerPageLoader from "../../components/seller/SellerPageLoader";
import useSellerPageLoader from "../../components/seller/useSellerPageLoader";
import SellerDashboardHealthCard from "../../components/seller/dashboard/SellerDashboardHealthCard";
import SellerDashboardHero from "../../components/seller/dashboard/SellerDashboardHero";
import SellerDashboardOverviewPanel from "../../components/seller/dashboard/SellerDashboardOverviewPanel";

const SellerDashboardPage = () => {
  const { dashboardData } = useOutletContext();
  const isLoading = useSellerPageLoader();

  const {
    sellerShop,
    sellerProductCount,
    sellerAvatar,
    runningEvents,
    recentOrders,
    overviewCards,
    averageRating,
  } = dashboardData;

  if (isLoading) {
    return <SellerPageLoader fullScreen={false} label="Loading dashboard" />;
  }

  return (
    <>
      <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <SellerDashboardHero
          sellerShop={sellerShop}
          sellerAvatar={sellerAvatar}
          averageRating={averageRating}
          sellerProductCount={sellerProductCount}
        />
        <SellerDashboardHealthCard />
      </section>

      <section className="mt-6">
        <SellerDashboardOverviewPanel
          overviewCards={overviewCards}
          recentOrders={recentOrders}
          runningEvents={runningEvents}
        />
      </section>
    </>
  );
};

export default SellerDashboardPage;
