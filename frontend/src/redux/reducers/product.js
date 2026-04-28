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
      // Also update the product in allProducts array
      if (state.allProducts && Array.isArray(state.allProducts)) {
        state.allProducts = state.allProducts.map(product => {
          const productId = product._id || product.id;
          const payloadId = action.payload._id || action.payload.id;
          return productId === payloadId ? action.payload : product;
        });
      }
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
    .addCase("updateProductInventory", (state, action) => {
      const { productId, quantity } = action.payload;

      // Update in allProducts
      state.allProducts = state.allProducts.map(product => {
        if (product._id === productId || product.id === productId) {
          return {
            ...product,
            stock: Math.max(0, (product.stock || 0) - quantity),
            sold_out: (product.sold_out || 0) + quantity
          };
        }
        return product;
      });

      // Update in sellerProducts
      state.sellerProducts = state.sellerProducts.map(product => {
        if (product._id === productId || product.id === productId) {
          return {
            ...product,
            stock: Math.max(0, (product.stock || 0) - quantity),
            sold_out: (product.sold_out || 0) + quantity
          };
        }
        return product;
      });

      // Update productDetails if it's the same product
      if (state.productDetails && (state.productDetails._id === productId || state.productDetails.id === productId)) {
        state.productDetails = {
          ...state.productDetails,
          stock: Math.max(0, (state.productDetails.stock || 0) - quantity),
          sold_out: (state.productDetails.sold_out || 0) + quantity
        };
      }
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
      state.allProductsError = null;
      state.productDetailsError = null;
      state.sellerProductsError = null;
    });
});
