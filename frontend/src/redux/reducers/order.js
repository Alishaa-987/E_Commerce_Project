import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  success: false,
  error: null,
  order: null,
  orders: [],
  userOrders: [],
  sellerOrders: [],
  orderCreateError: null,
  ordersError: null,
  sellerOrdersError: null,
  orderDetailsError: null,
  userOrdersLoading: false,
  userOrdersError: null,
  sellerOrdersLoading: false,
  orderDetailsLoading: false,
  orderDetails: null,
  purchaseCheck: {
    loading: false,
    error: null,
    hasPurchased: false,
    hasDelivered: false,
    userOrders: [],
    sellerOrders: [],
    reviewSubmitted: false,
  },
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("orderCreateRequest", (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
      state.order = null;
      state.orderCreateError = null;
    })
    .addCase("orderCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.order = action.payload;
      state.error = null;
    })
    .addCase("orderCreateFail", (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.payload;
      state.orderCreateError = action.payload;
    })
    .addCase("getUserOrdersRequest", (state) => {
      state.userOrdersLoading = true;
      state.userOrdersError = null;
    })
    .addCase("getUserOrdersSuccess", (state, action) => {
      state.userOrdersLoading = false;
      state.userOrders = action.payload;
      state.orders = action.payload;
    })
    .addCase("getUserOrdersFail", (state, action) => {
      state.userOrdersLoading = false;
      state.userOrdersError = action.payload;
      state.ordersError = action.payload;
    })
    .addCase("getSellerOrdersRequest", (state) => {
      state.sellerOrdersLoading = true;
      state.sellerOrdersError = null;
    })
    .addCase("getSellerOrdersSuccess", (state, action) => {
      state.sellerOrdersLoading = false;
      state.sellerOrders = action.payload;
      state.orders = action.payload;
    })
    .addCase("getSellerOrdersFail", (state, action) => {
      state.sellerOrdersLoading = false;
      state.sellerOrdersError = action.payload;
      state.ordersError = action.payload;
    })
    .addCase("getOrderDetailsRequest", (state) => {
      state.orderDetailsLoading = true;
      state.orderDetailsError = null;
    })
    .addCase("getOrderDetailsSuccess", (state, action) => {
      state.orderDetailsLoading = false;
      state.orderDetails = action.payload;
    })
    .addCase("getOrderDetailsFail", (state, action) => {
      state.orderDetailsLoading = false;
      state.orderDetailsError = action.payload;
    })
    .addCase("orderUpdated", (state, action) => {
      const updateArray = (arr) => {
        if (!arr || !Array.isArray(arr)) return arr;
        return arr.map((order) =>
          order._id === action.payload._id || order.id === action.payload.id
            ? action.payload
            : order
        );
      };
      state.orders = updateArray(state.orders);
      state.userOrders = updateArray(state.userOrders);
      state.sellerOrders = updateArray(state.sellerOrders);
      if (state.orderDetails) {
        const currentId = state.orderDetails._id || state.orderDetails.id;
        const newId = action.payload._id || action.payload.id;
        if (currentId === newId) {
          state.orderDetails = action.payload;
        }
      }
      if (state.order) {
        const currentId = state.order._id || state.order.id;
        const newId = action.payload._id || action.payload.id;
        if (currentId === newId) {
          state.order = action.payload;
        }
      }
    })
    .addCase("getSellerRefundOrdersRequest", (state) => {
      state.sellerOrdersLoading = true;
      state.sellerOrdersError = null;
    })
    .addCase("getSellerRefundOrdersSuccess", (state, action) => {
      state.sellerOrdersLoading = false;
      state.sellerOrders = action.payload;
    })
    .addCase("getSellerRefundOrdersFail", (state, action) => {
      state.sellerOrdersLoading = false;
      state.sellerOrdersError = action.payload;
    })
    .addCase("updateProductInventory", (state, action) => {
      if (state.orders && Array.isArray(state.orders)) {
        state.orders = state.orders.map((order) => ({
          ...order,
          cart: order.cart?.map((item) => {
            if (item.id === action.payload.productId || item._id === action.payload.productId) {
              return {
                ...item,
                stock: Math.max(0, (item.stock || 0) - action.payload.quantity),
              };
            }
            return item;
          }),
        }));
      }
      if (state.orderDetails) {
        state.orderDetails = {
          ...state.orderDetails,
          cart: state.orderDetails.cart?.map((item) => {
            if (item.id === action.payload.productId || item._id === action.payload.productId) {
              return {
                ...item,
                stock: Math.max(0, (item.stock || 0) - action.payload.quantity),
              };
            }
            return item;
          }),
        };
      }
      if (state.order) {
        state.order = {
          ...state.order,
          cart: state.order.cart?.map((item) => {
            if (item.id === action.payload.productId || item._id === action.payload.productId) {
              return {
                ...item,
                stock: Math.max(0, (item.stock || 0) - action.payload.quantity),
              };
            }
            return item;
          }),
        };
      }
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
      state.orderCreateError = null;
      state.ordersError = null;
      state.sellerOrdersError = null;
      state.orderDetailsError = null;
    })
    .addCase("checkProductPurchaseRequest", (state) => {
      state.purchaseCheck.loading = true;
      state.purchaseCheck.error = null;
    })
    .addCase("checkProductPurchaseSuccess", (state, action) => {
      state.purchaseCheck.loading = false;
      state.purchaseCheck.hasPurchased = action.payload.hasPurchased;
      state.purchaseCheck.hasDelivered = action.payload.hasDelivered;
      state.purchaseCheck.orders = action.payload.orders || [];
      state.purchaseCheck.reviewSubmitted = action.payload.reviewSubmitted;
    })
    .addCase("checkProductPurchaseFail", (state, action) => {
      state.purchaseCheck.loading = false;
      state.purchaseCheck.error = action.payload;
    });
});