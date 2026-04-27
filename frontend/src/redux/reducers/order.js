.addCase("clearErrors", (state) => {
      state.error = null;
      state.orderCreateError = null;
      state.ordersError = null;
      state.sellerOrdersError = null;
      state.orderDetailsError = null;
    });