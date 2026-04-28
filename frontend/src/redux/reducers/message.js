import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const messageReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("messageCreateRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("messageCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.messages = [...state.messages, action.payload];
      state.success = true;
    })
    .addCase("messageCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase("getAllMessagesRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllMessagesSuccess", (state, action) => {
      state.isLoading = false;
      state.messages = action.payload;
    })
    .addCase("getAllMessagesFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
