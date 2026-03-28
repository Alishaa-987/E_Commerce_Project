import React from "react";
import SellerDashboardWorkspacePanel from "../../components/seller/dashboard/SellerDashboardWorkspacePanel";
import {
  getSellerNavItem,
  sellerDashboardWorkspaceCopy,
} from "../../components/seller/sellerWorkspace";

const SellerWorkspaceSectionPage = ({ sectionKey }) => {
  const sectionTitle = getSellerNavItem(sectionKey)?.label || "Workspace";

  return (
    <SellerDashboardWorkspacePanel
      sectionTitle={sectionTitle}
      description={sellerDashboardWorkspaceCopy[sectionKey]}
    />
  );
};

export default SellerWorkspaceSectionPage;
