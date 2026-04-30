import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const itemIndex = state.cart.findIndex((cartItem) => cartItem._id === item._id);

      if (itemIndex >= 0) {
        state.cart[itemIndex] = item;
        return;
      }

      state.cart.push(item);
    })
    .addCase("removeFromCartRequest", (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    });
});
