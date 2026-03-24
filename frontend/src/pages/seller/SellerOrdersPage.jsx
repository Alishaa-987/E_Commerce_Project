import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerPageLoader from "../../components/seller/SellerPageLoader";
import SellerDashboardOrdersPanel from "../../components/seller/dashboard/SellerDashboardOrdersPanel";
import useSellerPageLoader from "../../components/seller/useSellerPageLoader";

const SellerOrdersPage = () => {
  const { dashboardData } = useOutletContext();
  const isLoading = useSellerPageLoader();

  if (isLoading) {
    return <SellerPageLoader fullScreen={false} label="Loading orders" />;
  }

  return <SellerDashboardOrdersPanel recentOrders={dashboardData.recentOrders} />;
};

export default SellerOrdersPage;
