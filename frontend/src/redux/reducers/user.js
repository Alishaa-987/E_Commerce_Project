import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
  name: "user",
  initialState: {
    user: {},
    isLoading: true,
    isAuthenticated: false,
    error: null,
    profileUpdateLoading: false,
    profileUpdateError: null,
    addressActionLoading: false,
    addressActionError: null,
    addressActionId: "",
    successMessage: "",
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
      state.profileUpdateError = null;
      state.addressActionError = null;
    },
    LoadingUserFail: (state, action) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
      state.successMessage = "";
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
    UpdateUserProfileRequest: (state) => {
      state.profileUpdateLoading = true;
      state.profileUpdateError = null;
      state.successMessage = "";
    },
    UpdateUserProfileSuccess: (state, action) => {
      state.profileUpdateLoading = false;
      state.profileUpdateError = null;
      state.isAuthenticated = true;
      state.user = action.payload.user || state.user;
      state.successMessage = action.payload.message || "Profile updated successfully.";
    },
    UpdateUserProfileFail: (state, action) => {
      state.profileUpdateLoading = false;
      state.profileUpdateError = action.payload;
    },
    UserAddressActionRequest: (state, action) => {
      state.addressActionLoading = true;
      state.addressActionError = null;
      state.addressActionId = action.payload || "";
      state.successMessage = "";
    },
    UserAddressActionSuccess: (state, action) => {
      state.addressActionLoading = false;
      state.addressActionError = null;
      state.addressActionId = "";
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.successMessage = action.payload.message || "Address updated successfully.";
    },
    UserAddressActionFail: (state, action) => {
      state.addressActionLoading = false;
      state.addressActionError = action.payload;
      state.addressActionId = "";
    },
    clearUserFeedback: (state) => {
      state.profileUpdateError = null;
      state.addressActionError = null;
      state.successMessage = "";
    },
    clearErrors: (state) => {
      state.error = null;
      state.profileUpdateError = null;
      state.addressActionError = null;
    },
  },
});

export const {
  LoadingUserRequest,
  LoadingUserSuccess,
  LoadingUserFail,
  LogoutSuccess,
  LogoutFail,
  UpdateUserProfileRequest,
  UpdateUserProfileSuccess,
  UpdateUserProfileFail,
  UserAddressActionRequest,
  UserAddressActionSuccess,
  UserAddressActionFail,
  clearUserFeedback,
  clearErrors,
} = userReducer.actions;
export default userReducer.reducer;
