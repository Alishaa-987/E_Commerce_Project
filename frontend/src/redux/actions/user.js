import axios from "axios";
import { server } from "../../server";
import {
  LoadingUserRequest,
  LoadingUserSuccess,
  LoadingUserFail,
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
