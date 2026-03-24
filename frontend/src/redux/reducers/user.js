import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
  name: "user",
  initialState: {
    user: {},
    isLoading: true,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    LoadingUserRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    LoadingUserSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    LoadingUserFail: (state, action) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    LogoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = {};
    },
    LogoutFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  LoadingUserRequest,
  LoadingUserSuccess,
  LoadingUserFail,
  LogoutSuccess,
  LogoutFail,
  clearErrors,
} = userReducer.actions;
export default userReducer.reducer;
