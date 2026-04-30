import React from "react";
import SellerDashboardWorkspacePanel from "../../components/seller/dashboard/SellerDashboardWorkspacePanel";
import {
  getSellerNavItem,
  sellerDashboardWorkspaceCopy,
} from "../../components/seller/sellerWorkspace";

import SellerRefundsPanel from "../../components/seller/dashboard/SellerRefundsPanel";
import SellerWithdrawPanel from "../../components/seller/dashboard/SellerWithdrawPanel";

const SellerWorkspaceSectionPage = ({ sectionKey }) => {
  const sectionTitle = getSellerNavItem(sectionKey)?.label || "Workspace";

  if (sectionKey === "refunds") {
    return <SellerRefundsPanel />;
  }

  if (sectionKey === "withdrawMoney") {
    return <SellerWithdrawPanel />;
  }

  return (
    <SellerDashboardWorkspacePanel
      sectionTitle={sectionTitle}
      description={sellerDashboardWorkspaceCopy[sectionKey]}
    />
  );
};

export default SellerWorkspaceSectionPage;
