import axios from "axios";
import { server } from "../../server";
import { normalizeEvent } from "../../utils/marketplace";

export const createEvent = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "eventCreateRequest",
    });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    const { data } = await axios.post(`${server}/event/create-event`, newForm, config);

    dispatch({
      type: "eventCreateSuccess",
      payload: normalizeEvent(data.event),
    });

    return {
      success: true,
      event: data.event,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Event could not be created.";
    dispatch({
      type: "eventCreateFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllEventsRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events`);

    dispatch({
      type: "getAllEventsSuccess",
      payload: data.events.map((event) => normalizeEvent(event)),
    });

    return {
      success: true,
      events: data.events,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Events could not be loaded.";
    dispatch({
      type: "getAllEventsFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const getEventDetails = (eventId) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${server}/event/get-event/${eventId}`);

    return {
      success: true,
      event: normalizeEvent(data.event),
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Event details could not be loaded.",
    };
  }
};

export const getAllEventsShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllEventsShopRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events-shop/${shopId}`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllEventsShopSuccess",
      payload: data.events.map((event) => normalizeEvent(event)),
    });

    return {
      success: true,
      events: data.events,
    };
  } catch (error) {
    const message = error.response?.data?.message || "Seller events could not be loaded.";
    dispatch({
      type: "getAllEventsShopFail",
      payload: message,
    });

    return {
      success: false,
      message,
    };
  }
};

export const deleteEvent = (eventId, shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteEventRequest",
      payload: eventId,
    });

    const { data } = await axios.delete(`${server}/event/delete-shop-event/${eventId}`, {
      params: { shopId },
      withCredentials: true,
    });

    dispatch({
      type: "deleteEventSuccess",
      payload: eventId,
    });

    return {
      success: true,
      message: data?.message || "Event deleted successfully.",
    };
  } catch (error) {
    const message = error.response?.data?.message || "Event could not be deleted.";
    dispatch({
      type: "deleteEventFail",
      payload: {
        eventId,
        message,
      },
    });

    return {
      success: false,
      message,
    };
  }
};
