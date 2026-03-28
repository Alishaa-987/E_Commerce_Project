import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerDashboardInboxPanel from "../../components/seller/dashboard/SellerDashboardInboxPanel";

const SellerInboxPage = () => {
  const { dashboardData } = useOutletContext();

  return <SellerDashboardInboxPanel inboxThreads={dashboardData.inboxThreads} />;
};

export default SellerInboxPage;
