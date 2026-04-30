import React from "react";
import { useOutletContext } from "react-router-dom";
import SellerCreateProductPanel from "../../components/seller/dashboard/SellerCreateProductPanel";

const SellerCreateProductPage = () => {
  const { dashboardData, refreshDashboardData } = useOutletContext();

  return (
    <SellerCreateProductPanel
      sellerShop={dashboardData.sellerShop}
      onProductCreated={refreshDashboardData}
    />
  );
};

export default SellerCreateProductPage;
