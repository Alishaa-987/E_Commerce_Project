import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  success: false,
  error: null,
  allProducts: [],
  allProductsLoading: false,
  allProductsError: null,
  productDetails: null,
  productDetailsLoading: false,
  productDetailsError: null,
  sellerProducts: [],
  sellerProductsLoading: false,
  sellerProductsError: null,
  deleteProductLoading: false,
  deletingProductId: null,
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("productCreateRequest", (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    })
    .addCase("productCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.product = action.payload;
      state.sellerProducts = [action.payload, ...state.sellerProducts];
      state.allProducts = [action.payload, ...state.allProducts];
    })
    .addCase("productCreateFail", (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.payload;
    })
    .addCase("getAllProductsRequest", (state) => {
      state.allProductsLoading = true;
      state.allProductsError = null;
    })
    .addCase("getAllProductsSuccess", (state, action) => {
      state.allProductsLoading = false;
      state.allProducts = action.payload;
    })
    .addCase("getAllProductsFail", (state, action) => {
      state.allProductsLoading = false;
      state.allProductsError = action.payload;
    })
    .addCase("getProductDetailsRequest", (state) => {
      state.productDetailsLoading = true;
      state.productDetailsError = null;
    })
    .addCase("getProductDetailsSuccess", (state, action) => {
      state.productDetailsLoading = false;
      state.productDetails = action.payload;
    })
    .addCase("getProductDetailsFail", (state, action) => {
      state.productDetailsLoading = false;
      state.productDetailsError = action.payload;
    })
    .addCase("getAllProductsShopRequest", (state) => {
      state.sellerProductsLoading = true;
      state.sellerProductsError = null;
    })
    .addCase("getAllProductsShopSuccess", (state, action) => {
      state.sellerProductsLoading = false;
      state.sellerProducts = action.payload;
    })
    .addCase("getAllProductsShopFail", (state, action) => {
      state.sellerProductsLoading = false;
      state.sellerProductsError = action.payload;
    })
    .addCase("deleteProductRequest", (state, action) => {
      state.deleteProductLoading = true;
      state.deletingProductId = action.payload;
      state.sellerProductsError = null;
    })
    .addCase("deleteProductSuccess", (state, action) => {
      state.deleteProductLoading = false;
      state.deletingProductId = null;
      state.sellerProducts = state.sellerProducts.filter(
        (product) => product.id !== action.payload
      );
      state.allProducts = state.allProducts.filter(
        (product) => product.id !== action.payload
      );
      if (state.productDetails?.id === action.payload) {
        state.productDetails = null;
      }
    })
    .addCase("deleteProductFail", (state, action) => {
      state.deleteProductLoading = false;
      state.deletingProductId = null;
      state.sellerProductsError = action.payload.message;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
      state.allProductsError = null;
      state.productDetailsError = null;
      state.sellerProductsError = null;
    });
});
