import React, { useEffect, useState } from "react";
import SellerDashboardOrdersPanel from "../../components/seller/dashboard/SellerDashboardOrdersPanel";
import { useDispatch, useSelector } from "react-redux";
import { getSellerOrders, updateOrderStatus, sendOrderMessage } from "../../redux/actions/order";

const SellerOrdersPage = () => {
  const dispatch = useDispatch();
  const { sellerOrders, sellerOrdersLoading, sellerOrdersError } = useSelector(
    (state) => state.order
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    const sellerId =
      typeof window !== "undefined" ? window.localStorage.getItem("sellerId") : "";

    if (!sellerId) {
      return;
    }

    dispatch(getSellerOrders(sellerId));
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdating(true);

    try {
      const result = await dispatch(updateOrderStatus(orderId, newStatus));
      
      // Refresh orders immediately after successful update to ensure UI sync
      // This works as a fallback if Socket.IO or Redux updates have timing issues
      const sellerId =
        typeof window !== "undefined" ? window.localStorage.getItem("sellerId") : "";
      if (sellerId) {
        console.log("🔄 Refreshing orders list after status update");
        await dispatch(getSellerOrders(sellerId));
      }
      
      return result;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendMessage = async (orderId, userId, message) => {
    setIsSendingMessage(true);

    try {
      const result = await dispatch(sendOrderMessage(orderId, userId, message));
      return result;
    } finally {
      setIsSendingMessage(false);
    }
  };

  const sellerId =
    typeof window !== "undefined" ? window.localStorage.getItem("sellerId") : "";

  if (!sellerId) {
    return (
      <SellerDashboardOrdersPanel
        recentOrders={[]}
        isLoading={false}
        error="Seller session could not be found."
      />
    );
  }

  return (
    <SellerDashboardOrdersPanel
      recentOrders={sellerOrders}
      isLoading={sellerOrdersLoading}
      error={sellerOrdersError}
      onStatusChange={handleStatusChange}
      onSendMessage={handleSendMessage}
      isUpdating={isUpdating}
      isSendingMessage={isSendingMessage}
    />
  );
};

export default SellerOrdersPage;
