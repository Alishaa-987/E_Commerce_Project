import axios from "axios";
import { server } from "../../server";

import { decodeText } from "../../utils/marketplace";

const normalizeOrderPayload = (order) => {
  if (!order || typeof order !== "object") {
    return order;
  }

  return {
    ...order,
    shopName: decodeText(order.shopName),
    cart: Array.isArray(order.cart)
      ? order.cart.map((item) => ({
          ...item,
          name: decodeText(item?.name),
        }))
      : order.cart,
  };
};


export const createOrder = (orderData) => async (dispatch) => {
  dispatch({ type: "orderCreateRequest" });

  try {

    const { data } = await axios.post(`${server}/order/create-order`, orderData, {
      withCredentials: true,
    });

    dispatch({ type: "orderCreateSuccess", payload: data.order });

    return {
      success: true,
      message: data.message,
      order: data.order,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Order creation failed.";
    dispatch({ type: "orderCreateFail", payload: message });

    return {
      success: false,
      message,
    };
  }
};

export const getUserOrders = () => async (dispatch) => {
  dispatch({ type: "getUserOrdersRequest" });

  try {
    const { data } = await axios.get(`${server}/order/user-orders`, {
      withCredentials: true,
    });


    const cleanedOrders = Array.isArray(data.orders)
      ? data.orders.map(normalizeOrderPayload)
      : [];

    dispatch({ type: "getUserOrdersSuccess", payload: cleanedOrders });
    return {
      success: true,
      orders: cleanedOrders,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch orders.";
    dispatch({ type: "getUserOrdersFail", payload: message });

    return {
      success: false,
      message,
    };
  }
};

export const getSellerOrders = (shopId) => async (dispatch) => {
  dispatch({ type: "getSellerOrdersRequest" });

  try {
    const { data } = await axios.get(`${server}/order/seller-orders/${shopId}`);


    const cleanedOrders = Array.isArray(data.orders)
      ? data.orders.map(normalizeOrderPayload)
      : [];

    dispatch({ type: "getSellerOrdersSuccess", payload: cleanedOrders });
    return {
      success: true,
      orders: cleanedOrders,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch seller orders.";
    dispatch({ type: "getSellerOrdersFail", payload: message });

    return {
      success: false,
      message,
    };
  }
};

export const getOrderDetails = (orderId) => async (dispatch) => {
  dispatch({ type: "getOrderDetailsRequest" });

  try {
    const { data } = await axios.get(`${server}/order/order/${orderId}`, {
      withCredentials: true,
    });

    const cleanedOrder = normalizeOrderPayload(data.order);
    dispatch({ type: "getOrderDetailsSuccess", payload: cleanedOrder });

    return {
      success: true,
      order: cleanedOrder,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch order details.";
    dispatch({ type: "getOrderDetailsFail", payload: message });

    return {
      success: false,
      message,
    };
  }
};

export const updateOrderStatus = (orderId, orderStatus) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      `${server}/order/${orderId}/status`,
      { orderStatus },
      {
        withCredentials: true,
      }
    );

    const cleanedUpdatedOrder = normalizeOrderPayload(data.order);
    // Update the order in state
    dispatch({ type: "getOrderDetailsSuccess", payload: cleanedUpdatedOrder });
    
    // Also update orders lists to ensure immediate UI updates without relying solely on Socket.IO
    dispatch({ type: "orderUpdated", payload: cleanedUpdatedOrder });

    // If status changed to "delivered", update product inventory
    if (orderStatus === "delivered") {
      // Get the order details to access cart items
      const orderResponse = await axios.get(`${server}/order/order/${orderId}`, {
        withCredentials: true,
      });

      if (orderResponse.data.success) {
        const order = orderResponse.data.order;
        // Update inventory for each product in the cart
        order.cart.forEach(item => {
          if ((item.id || item._id) && item.qty) {
            dispatch({
              type: "updateProductInventory",
              payload: {
                productId: item.id || item._id,
                quantity: item.qty
              }
            });
          }
        });
      }
    }

    return {
      success: true,
      message: data.message,
      order: data.order,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update order status.";

    return {
      success: false,
      message,
    };
  }
};

export const sendOrderMessage = (orderId, userId, message) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${server}/order/${orderId}/message`,
      { userId, message },
      {
        withCredentials: true,
      }
    );

    return {
      success: true,
      message: data.message || "Message sent successfully.",
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to send message.";

    return {
      success: false,
      message,
    };
  }
};


export const requestRefund = (orderId, reason) => async (dispatch) => {
  dispatch({ type: "orderCreateRequest" });

  try {
    const { data } = await axios.post(
      `${server}/order/${orderId}/request-refund`,
      { reason },
      {
        withCredentials: true,
      }
    );

    // Update the order in state with refund info
    dispatch({ type: "orderUpdated", payload: data.order || {} });

    return {
      success: true,
      message: data.message,
      refund: data.refund,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to request refund.";
    dispatch({ type: "orderCreateFail", payload: message });

    return {
      success: false,
      message,
    };
  }
};

export const getRefundStatus = (orderId) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${server}/order/${orderId}/refund-status`, {
      withCredentials: true,
    });

    return {
      success: true,
      refund: data.refund,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch refund status.";

    return {
      success: false,
      message,
    };
  }
};

