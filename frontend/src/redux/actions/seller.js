import axios from "axios";
import { server } from "../../server";
import { normalizeSeller } from "../../utils/marketplace";

export const loadSellerById = (sellerId) => async (dispatch) => {
  try {
    dispatch({
      type: "loadSellerRequest",
    });

    const { data } = await axios.get(`${server}/seller/get-seller-info/${sellerId}`, {
      withCredentials: true,
    });

    dispatch({
      type: "loadSellerSuccess",
      payload: normalizeSeller(data.seller, data.seller?.productCount),
    });

    return {
      success: true,
      seller: data.seller,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Seller profile could not be loaded.";
    dispatch({
      type: "loadSellerFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const getAllShops = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllShopsRequest",
    });

    const { data } = await axios.get(`${server}/seller/get-all-sellers`);

    dispatch({
      type: "getAllShopsSuccess",
      payload: data.sellers.map((seller) =>
        normalizeSeller(seller, seller?.productCount)
      ),
    });

    return {
      success: true,
      sellers: data.sellers,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Shops could not be loaded.";
    dispatch({
      type: "getAllShopsFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const getShopByHandle = (handle) => async (dispatch) => {
  try {
    dispatch({
      type: "getShopByHandleRequest",
    });

    const { data } = await axios.get(`${server}/seller/get-shop/${handle}`);

    dispatch({
      type: "getShopByHandleSuccess",
      payload: normalizeSeller(data.seller, data.seller?.productCount),
    });

    return {
      success: true,
      seller: data.seller,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Shop could not be loaded.";
    dispatch({
      type: "getShopByHandleFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};
export const updateSellerInfo = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: "updateSellerInfoRequest",
    });

    const { data } = await axios.put(`${server}/seller/update-seller-info`, formData, {
      withCredentials: true,
    });

    dispatch({
      type: "updateSellerInfoSuccess",
      payload: normalizeSeller(data.seller, data.seller?.productCount),
    });

    return {
      success: true,
      seller: data.seller,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update seller info.";
    dispatch({
      type: "updateSellerInfoFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const updateSellerPassword = (passwordData) => async (dispatch) => {
  try {
    dispatch({
      type: "updateSellerPasswordRequest",
    });

    const { data } = await axios.put(`${server}/seller/update-seller-password`, passwordData, {
      withCredentials: true,
    });

    dispatch({
      type: "updateSellerPasswordSuccess",
    });

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update password.";
    dispatch({
      type: "updateSellerPasswordFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const updateShopBanner = (file) => async (dispatch) => {
  try {
    dispatch({
      type: "updateShopBannerRequest",
    });

    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.put(`${server}/seller/update-shop-banner`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch({
      type: "updateShopBannerSuccess",
      payload: data.banner,
    });

    return {
      success: true,
      banner: data.banner,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update banner.";
    dispatch({
      type: "updateShopBannerFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};
