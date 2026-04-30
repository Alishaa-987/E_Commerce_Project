import axios from "axios";
import { server } from "../../server";

// create conversation
export const createConversation = (groupTitle, userId, sellerId) => async (dispatch) => {
  try {
    dispatch({
      type: "conversationCreateRequest",
    });

    const { data } = await axios.post(
      `${server}/conversation/create-new-conversation`,
      {
        groupTitle,
        userId,
        sellerId,
      },
      { withCredentials: true }
    );

    dispatch({
      type: "conversationCreateSuccess",
      payload: data.conversation,
    });
    return data;
  } catch (error) {
    dispatch({
      type: "conversationCreateFail",
      payload: error.response.data.message,
    });
  }
};

// get all conversations of user
export const getAllConversationsUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllConversationsUserRequest",
    });

    const { data } = await axios.get(
      `${server}/conversation/get-all-conversation-user/${userId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getAllConversationsUserSuccess",
      payload: data.conversations,
    });
  } catch (error) {
    dispatch({
      type: "getAllConversationsUserFail",
      payload: error.response.data.message,
    });
  }
};

// get all conversations of seller
export const getAllConversationsSeller = (sellerId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllConversationsSellerRequest",
    });

    const { data } = await axios.get(
      `${server}/conversation/get-all-conversation-seller/${sellerId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getAllConversationsSellerSuccess",
      payload: data.conversations,
    });
  } catch (error) {
    dispatch({
      type: "getAllConversationsSellerFail",
      payload: error.response.data.message,
    });
  }
};
