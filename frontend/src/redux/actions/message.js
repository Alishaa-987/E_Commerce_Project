import axios from "axios";
import { server } from "../../server";

// create new message
export const createMessage = (messageData) => async (dispatch) => {
  try {
    dispatch({
      type: "messageCreateRequest",
    });

    const { data } = await axios.post(
      `${server}/message/create-new-message`,
      messageData,
      { withCredentials: true }
    );

    dispatch({
      type: "messageCreateSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "messageCreateFail",
      payload: error.response.data.message,
    });
  }
};

// get all messages
export const getAllMessages = (conversationId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllMessagesRequest",
    });

    const { data } = await axios.get(
      `${server}/message/get-all-messages/${conversationId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getAllMessagesSuccess",
      payload: data.messages,
    });
  } catch (error) {
    dispatch({
      type: "getAllMessagesFail",
      payload: error.response.data.message,
    });
  }
};
