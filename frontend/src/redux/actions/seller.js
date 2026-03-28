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
