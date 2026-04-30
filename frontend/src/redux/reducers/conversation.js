import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  isLoading: false,
  error: null,
  conversation: null,
};

export const conversationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("conversationCreateRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("conversationCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.conversation = action.payload;
      state.success = true;
    })
    .addCase("conversationCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase("getAllConversationsUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllConversationsUserSuccess", (state, action) => {
      state.isLoading = false;
      state.conversations = action.payload;
    })
    .addCase("getAllConversationsUserFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("getAllConversationsSellerRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllConversationsSellerSuccess", (state, action) => {
      state.isLoading = false;
      state.conversations = action.payload;
    })
    .addCase("getAllConversationsSellerFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
