import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerDashboardOrdersPanel from "../../components/seller/dashboard/SellerDashboardOrdersPanel";

const SellerOrdersPage = () => {
  const { dashboardData } = useOutletContext();

  return <SellerDashboardOrdersPanel recentOrders={dashboardData.recentOrders} />;
};

export default SellerOrdersPage;
