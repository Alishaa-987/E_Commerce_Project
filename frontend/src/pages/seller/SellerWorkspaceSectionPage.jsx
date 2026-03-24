import React from "react";
import SellerPageLoader from "../../components/seller/SellerPageLoader";
import SellerDashboardWorkspacePanel from "../../components/seller/dashboard/SellerDashboardWorkspacePanel";
import useSellerPageLoader from "../../components/seller/useSellerPageLoader";
import {
  getSellerNavItem,
  sellerDashboardWorkspaceCopy,
} from "../../components/seller/sellerWorkspace";

const SellerWorkspaceSectionPage = ({ sectionKey }) => {
  const isLoading = useSellerPageLoader();
  const sectionTitle = getSellerNavItem(sectionKey)?.label || "Workspace";

  if (isLoading) {
    return <SellerPageLoader fullScreen={false} label={`Loading ${sectionTitle}`} />;
  }

  return (
    <SellerDashboardWorkspacePanel
      sectionTitle={sectionTitle}
      description={sellerDashboardWorkspaceCopy[sectionKey]}
    />
  );
};

export default SellerWorkspaceSectionPage;
