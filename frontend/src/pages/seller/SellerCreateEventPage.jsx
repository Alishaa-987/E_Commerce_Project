import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerCreateEventPanel from "../../components/seller/dashboard/SellerCreateEventPanel";

const SellerCreateEventPage = () => {
  const { dashboardData, refreshDashboardData } = useOutletContext();

  return (
    <SellerCreateEventPanel
      sellerShop={dashboardData.sellerShop}
      onEventCreated={refreshDashboardData}
    />
  );
};

export default SellerCreateEventPage;
