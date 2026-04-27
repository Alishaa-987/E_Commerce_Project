import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { server } from "../../server";

let stripePromise;

const StripeProvider = ({ children }) => {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const { data } = await axios.get(`${server}/payment/stripeapikey`, {
          withCredentials: true,
        });
        
        if (!data.stripeApiKey) {
          setError("Stripe API key is not configured on the server.");
          setLoading(false);
          return;
        }

        // Check if it's still a placeholder
        if (data.stripeApiKey.includes("YOUR_PUBLISHABLE_KEY")) {
          setError("Stripe API key has not been set up. Please configure Stripe keys in backend/.env");
          setLoading(false);
          return;
        }

        setStripeApiKey(data.stripeApiKey);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch Stripe API key:", err);
        setError(
          err.response?.data?.message || 
          "Failed to load payment system. Please refresh and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStripeKey();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0b0d]">
        <p className="text-white">Loading payment system...</p>
      </div>
    );
  }

  if (error || !stripeApiKey) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0b0d] px-4">
        <div className="max-w-md text-center">
          <p className="text-white font-semibold mb-2">Payment System Error</p>
          <p className="text-white/60 text-sm">{error || "Payment system unavailable."}</p>
          <p className="text-white/40 text-xs mt-4">Contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    stripePromise = loadStripe(stripeApiKey);
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;
