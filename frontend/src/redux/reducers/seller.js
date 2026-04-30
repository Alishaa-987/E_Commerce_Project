import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  currentSeller: null,
  currentSellerLoading: false,
  currentSellerError: null,
  allShops: [],
  allShopsLoading: false,
  allShopsError: null,
  publicShop: null,
  publicShopLoading: false,
  publicShopError: null,
};

export const sellerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("loadSellerRequest", (state) => {
      state.currentSellerLoading = true;
      state.currentSellerError = null;
    })
    .addCase("loadSellerSuccess", (state, action) => {
      state.currentSellerLoading = false;
      state.currentSeller = action.payload;
    })
    .addCase("loadSellerFail", (state, action) => {
      state.currentSellerLoading = false;
      state.currentSellerError = action.payload;
    })
    .addCase("getAllShopsRequest", (state) => {
      state.allShopsLoading = true;
      state.allShopsError = null;
    })
    .addCase("getAllShopsSuccess", (state, action) => {
      state.allShopsLoading = false;
      state.allShops = action.payload;
    })
    .addCase("getAllShopsFail", (state, action) => {
      state.allShopsLoading = false;
      state.allShopsError = action.payload;
    })
    .addCase("getShopByHandleRequest", (state) => {
      state.publicShopLoading = true;
      state.publicShopError = null;
    })
    .addCase("getShopByHandleSuccess", (state, action) => {
      state.publicShopLoading = false;
      state.publicShop = action.payload;
    })
    .addCase("getShopByHandleFail", (state, action) => {
      state.publicShopLoading = false;
      state.publicShopError = action.payload;
    })
    .addCase("updateSellerInfoRequest", (state) => {
      state.currentSellerLoading = true;
      state.currentSellerError = null;
    })
    .addCase("updateSellerInfoSuccess", (state, action) => {
      state.currentSellerLoading = false;
      state.currentSeller = action.payload;
    })
    .addCase("updateSellerInfoFail", (state, action) => {
      state.currentSellerLoading = false;
      state.currentSellerError = action.payload;
    })
    .addCase("updateSellerPasswordRequest", (state) => {
      state.currentSellerLoading = true;
      state.currentSellerError = null;
    })
    .addCase("updateSellerPasswordSuccess", (state) => {
      state.currentSellerLoading = false;
    })
    .addCase("updateSellerPasswordFail", (state, action) => {
      state.currentSellerLoading = false;
      state.currentSellerError = action.payload;
    })
    .addCase("clearSellerErrors", (state) => {
      state.currentSellerError = null;
      state.allShopsError = null;
      state.publicShopError = null;
    });
});
