import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  allEvents: [],
  allEventsLoading: false,
  allEventsError: null,
  sellerEvents: [],
  sellerEventsLoading: false,
  sellerEventsError: null,
  deleteEventLoading: false,
  deletingEventId: null,
  success: false,
  error: null,
};

export const eventReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("eventCreateRequest", (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    })
    .addCase("eventCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.sellerEvents = [action.payload, ...state.sellerEvents];
      state.allEvents = [action.payload, ...state.allEvents];
    })
    .addCase("eventCreateFail", (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.payload;
    })
    .addCase("getAllEventsRequest", (state) => {
      state.allEventsLoading = true;
      state.allEventsError = null;
    })
    .addCase("getAllEventsSuccess", (state, action) => {
      state.allEventsLoading = false;
      state.allEvents = action.payload;
    })
    .addCase("getAllEventsFail", (state, action) => {
      state.allEventsLoading = false;
      state.allEventsError = action.payload;
    })
    .addCase("getAllEventsShopRequest", (state) => {
      state.sellerEventsLoading = true;
      state.sellerEventsError = null;
    })
    .addCase("getAllEventsShopSuccess", (state, action) => {
      state.sellerEventsLoading = false;
      state.sellerEvents = action.payload;
    })
    .addCase("getAllEventsShopFail", (state, action) => {
      state.sellerEventsLoading = false;
      state.sellerEventsError = action.payload;
    })
    .addCase("deleteEventRequest", (state, action) => {
      state.deleteEventLoading = true;
      state.deletingEventId = action.payload;
      state.sellerEventsError = null;
    })
    .addCase("deleteEventSuccess", (state, action) => {
      state.deleteEventLoading = false;
      state.deletingEventId = null;
      state.sellerEvents = state.sellerEvents.filter((event) => event.id !== action.payload);
      state.allEvents = state.allEvents.filter((event) => event.id !== action.payload);
    })
    .addCase("deleteEventFail", (state, action) => {
      state.deleteEventLoading = false;
      state.deletingEventId = null;
      state.sellerEventsError = action.payload?.message || "Event could not be deleted.";
    })
    .addCase("clearEventErrors", (state) => {
      state.error = null;
      state.allEventsError = null;
      state.sellerEventsError = null;
    });
});
