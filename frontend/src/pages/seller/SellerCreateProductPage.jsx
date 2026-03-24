import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerPageLoader from "../../components/seller/SellerPageLoader";
import SellerCreateProductPanel from "../../components/seller/dashboard/SellerCreateProductPanel";
import useSellerPageLoader from "../../components/seller/useSellerPageLoader";

const SellerCreateProductPage = () => {
  const { dashboardData, refreshDashboardData } = useOutletContext();
  const isLoading = useSellerPageLoader();

  if (isLoading) {
    return <SellerPageLoader fullScreen={false} label="Loading create product" />;
  }

  return (
    <SellerCreateProductPanel
      sellerShop={dashboardData.sellerShop}
      onProductCreated={refreshDashboardData}
    />
  );
};

export default SellerCreateProductPage;
