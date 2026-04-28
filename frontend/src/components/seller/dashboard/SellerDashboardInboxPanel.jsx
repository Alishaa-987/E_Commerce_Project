import React from "react";

import Inbox from "../../messaging/Inbox";

const SellerDashboardInboxPanel = () => {
  return (
    <div className="w-full">
      <Inbox isSeller={true} />
    </div>
  );
};

export default SellerDashboardInboxPanel;
