import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerPageLoader from "../../components/seller/SellerPageLoader";
import SellerDashboardInboxPanel from "../../components/seller/dashboard/SellerDashboardInboxPanel";
import useSellerPageLoader from "../../components/seller/useSellerPageLoader";

const SellerInboxPage = () => {
  const { dashboardData } = useOutletContext();
  const isLoading = useSellerPageLoader();

  if (isLoading) {
    return <SellerPageLoader fullScreen={false} label="Loading inbox" />;
  }

  return <SellerDashboardInboxPanel inboxThreads={dashboardData.inboxThreads} />;
};

export default SellerInboxPage;
