import axios from "axios";
import { server } from "../../server";
import { normalizeProduct } from "../../utils/marketplace";

export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    const { data } = await axios.post(`${server}/product/create-product`, newForm, config);

    dispatch({
      type: "productCreateSuccess",
      payload: normalizeProduct(data.product),
    });

    return {
      success: true,
      product: data.product,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Product could not be created.";
    dispatch({
      type: "productCreateFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products`);

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products.map((product) => normalizeProduct(product)),
    });

    return {
      success: true,
      products: data.products,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Products could not be loaded.";
    dispatch({
      type: "getAllProductsFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const getProductDetails = (productId) => async (dispatch) => {
  try {
    dispatch({
      type: "getProductDetailsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-product/${productId}`);

    dispatch({
      type: "getProductDetailsSuccess",
      payload: normalizeProduct(data.product),
    });

    return {
      success: true,
      product: data.product,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Product details could not be loaded.";
    dispatch({
      type: "getProductDetailsFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const getAllProductsShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products-shop/${shopId}`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products.map((product) => normalizeProduct(product)),
    });

    return {
      success: true,
      products: data.products,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Seller products could not be loaded.";
    dispatch({
      type: "getAllProductsShopFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const deleteProduct = (productId, shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
      payload: productId,
    });

    const { data } = await axios.delete(`${server}/product/delete-shop-product/${productId}`, {
      params: { shopId },
      withCredentials: true,
    });

    dispatch({
      type: "deleteProductSuccess",
      payload: productId,
    });

    return {
      success: true,
      message: data?.message || "Product deleted successfully.",
    };
  } catch (error) {
    const message = error.response?.data?.message || "Product could not be deleted.";
    dispatch({
      type: "deleteProductFail",
      payload: {
        productId,
        message,
      },
    });

    return {
      success: false,
      message,
    };
  }
};
