import axios from "axios";
import { server } from "../../server";
import {
  LoadingUserRequest,
  LoadingUserSuccess,
  LoadingUserFail,
  UpdateUserProfileRequest,
  UpdateUserProfileSuccess,
  UpdateUserProfileFail,
  UserAddressActionRequest,
  UserAddressActionSuccess,
  UserAddressActionFail,
} from "../reducers/user";

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(LoadingUserRequest());
    const { data } = await axios.get(`${server}/user/getUser`, {
      withCredentials: true,
    });
    if (typeof window !== "undefined") {
      window.localStorage.setItem("userAuth", "true");
    }
    dispatch(LoadingUserSuccess(data.user));
  } catch (error) {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.localStorage.removeItem("userAuth");
    }
    dispatch(
      LoadingUserFail(error.response?.data?.message || "Failed to load user")
    );
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.get(`${server}/user/logout`, { withCredentials: true });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("userAuth");
    }
    dispatch({ type: "LogoutSuccess" });
  } catch (error) {
    dispatch({
      type: "LogoutFail",
      payload: error.response?.data?.message || "Logout failed",
    });
  }
};

export const addUserAddress = (addressData) => async (dispatch) => {
  try {
    dispatch(UserAddressActionRequest());

    const { data } = await axios.post(`${server}/user/add-address`, addressData, {
      withCredentials: true,
    });

    dispatch(
      UserAddressActionSuccess({
        user: data.user,
        message: data.message,
      })
    );

    return {
      success: true,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    dispatch(
      UserAddressActionFail(
        error.response?.data?.message || "Address could not be saved."
      )
    );

    return {
      success: false,
      message: error.response?.data?.message || "Address could not be saved.",
    };
  }
};

export const updateUserAddress = (addressId, addressData) => async (dispatch) => {
  try {
    dispatch(UserAddressActionRequest(addressId));

    const { data } = await axios.put(`${server}/user/update-address/${addressId}`, addressData, {
      withCredentials: true,
    });

    dispatch(
      UserAddressActionSuccess({
        user: data.user,
        message: data.message,
      })
    );

    return {
      success: true,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    dispatch(
      UserAddressActionFail(
        error.response?.data?.message || "Address could not be updated."
      )
    );

    return {
      success: false,
      message: error.response?.data?.message || "Address could not be updated.",
    };
  }
};

export const deleteUserAddress = (addressId) => async (dispatch) => {
  try {
    dispatch(UserAddressActionRequest(addressId));

    const { data } = await axios.delete(`${server}/user/delete-address/${addressId}`, {
      withCredentials: true,
    });

    dispatch(
      UserAddressActionSuccess({
        user: data.user,
        message: data.message,
      })
    );

    return {
      success: true,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    dispatch(
      UserAddressActionFail(
        error.response?.data?.message || "Address could not be deleted."
      )
    );

    return {
      success: false,
      message: error.response?.data?.message || "Address could not be deleted.",
    };
  }
};

export const updateUserProfile = (profileData) => async (dispatch) => {
  try {
    dispatch(UpdateUserProfileRequest());

    const { data } = await axios.put(`${server}/user/update-user-info`, profileData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch(
      UpdateUserProfileSuccess({
        user: data.user,
        message: data.message,
      })
    );

    return {
      success: true,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    dispatch(
      UpdateUserProfileFail(
        error.response?.data?.message || "Profile could not be updated."
      )
    );

    return {
      success: false,
      message: error.response?.data?.message || "Profile could not be updated.",
    };
  }
};

export const updateUserPassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(UpdateUserProfileRequest());

    const { data } = await axios.put(`${server}/user/update-user-password`, passwordData, {
      withCredentials: true,
    });

    dispatch(
      UpdateUserProfileSuccess({
        message: data.message,
      })
    );

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    dispatch(
      UpdateUserProfileFail(
        error.response?.data?.message || "Password could not be updated."
      )
    );

    return {
      success: false,
      message: error.response?.data?.message || "Password could not be updated.",
    };
  }
};
