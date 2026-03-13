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
    dispatch(LoadingUserSuccess(data.user));
  } catch (error) {
    dispatch(
      LoadingUserFail(error.response?.data?.message || "Failed to load user")
    );
  }
};
