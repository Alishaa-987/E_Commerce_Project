import axios from "axios";
import { server } from "../../server";

/**
 * Process payment with Stripe
 * @param {number} amount - Amount in cents (e.g., 5000 for $50.00)
 * @param {object} stripePaymentData - Stripe payment intent data
 * @returns {Promise}
 */
export const processPayment = (paymentPayload = {}) => async (dispatch) => {
  try {
    const requestBody =
      typeof paymentPayload === "number"
        ? { amount: paymentPayload }
        : paymentPayload;


    const { data } = await axios.post(
      `${server}/payment/process`,
      requestBody,
      { withCredentials: true }
    );

    return {
      success: true,
      clientSecret: data.client_secret,
      paymentIntentId: data.payment_intent_id,
      amount: data.amount,
      currency: data.currency,
      ...data,
    };
  } catch (error) {

    return {
      success: false,
      message: error.response?.data?.message || "Payment processing failed.",
    };
  }
};

/**
 * Get Stripe API key
 */
export const getStripeApiKey = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${server}/payment/stripeapikey`,
      { withCredentials: true }
    );

    return {
      success: true,
      stripeApiKey: data.stripeApiKey,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get Stripe API key.",
    };
  }
};
