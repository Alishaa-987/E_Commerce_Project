import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerPageLoader from "../../components/seller/SellerPageLoader";
import SellerDashboardProductsPanel from "../../components/seller/dashboard/SellerDashboardProductsPanel";
import useSellerPageLoader from "../../components/seller/useSellerPageLoader";

const SellerProductsPage = () => {
  const { dashboardData } = useOutletContext();
  const isLoading = useSellerPageLoader();

  if (isLoading) {
    return <SellerPageLoader fullScreen={false} label="Loading products" />;
  }

  return (
    <SellerDashboardProductsPanel sellerProducts={dashboardData.sellerProducts} />
  );
};

export default SellerProductsPage;
