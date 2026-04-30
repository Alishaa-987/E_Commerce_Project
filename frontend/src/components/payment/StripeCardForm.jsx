import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#fff",
      fontFamily: "Poppins, sans-serif",
      "::placeholder": {
        color: "rgba(255, 255, 255, 0.3)",
      },
    },
    invalid: {
      color: "#ff6b6b",
    },
  },
  classes: {
    focus: "focus",
    complete: "complete",
    empty: "empty",
    invalid: "invalid",
  },
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition";

const normalizeCountryCode = (countryCode = "", fallbackCountry = "") => {
  const normalizedCountryCode = String(countryCode || "")
    .trim()
    .toUpperCase();

  if (normalizedCountryCode.length === 2) {
    return normalizedCountryCode;
  }

  const normalizedFallback = String(fallbackCountry || "")
    .trim()
    .toUpperCase();

  return normalizedFallback.length === 2 ? normalizedFallback : undefined;
};

const buildBillingDetails = (billingDetails = {}) => {
  const name = String(billingDetails.name || "").trim();
  const email = String(billingDetails.email || "").trim();
  const phone = String(billingDetails.phone || "").trim();
  const line1 = String(billingDetails.address1 || "").trim();
  const line2 = String(billingDetails.address2 || "").trim();
  const city = String(billingDetails.city || "").trim();
  const postalCode = String(billingDetails.zipCode || "").trim();
  const country = normalizeCountryCode(
    billingDetails.countryCode,
    billingDetails.country
  );
  const address = {
    ...(line1 && { line1 }),
    ...(line2 && { line2 }),
    ...(city && { city }),
    ...(postalCode && { postal_code: postalCode }),
    ...(country && { country }),
  };

  return {
    ...(name && { name }),
    ...(email && { email }),
    ...(phone && { phone }),
    ...(Object.keys(address).length ? { address } : {}),
  };
};

const StripeCardForm = ({
  cardName,
  billingDetails,
  onCardNameChange,
  onCardStateChange,
  onPaymentMethodReady,
  isProcessing = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [fieldState, setFieldState] = useState({
    cardNumberComplete: false,
    cardExpiryComplete: false,
    cardCvcComplete: false,
  });
  const createPaymentMethodRef = useRef(null);

  const handleCardChange = (field) => (event) => {
    setFieldState((current) => ({
      ...current,
      [field]: Boolean(event.complete),
    }));

    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError("");
    }
  };

  const isCardComplete =
    fieldState.cardNumberComplete &&
    fieldState.cardExpiryComplete &&
    fieldState.cardCvcComplete;

  const createPaymentMethod = useCallback(async () => {
    if (!stripe || !elements) {
      setCardError("Payment system not ready. Please refresh and try again.");
      return null;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setCardError("Card form is not fully loaded. Please try again.");
      return null;
    }

    try {
      const normalizedBillingDetails = buildBillingDetails({
        ...billingDetails,
        name: cardName,
      });

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        ...(Object.keys(normalizedBillingDetails).length
          ? { billing_details: normalizedBillingDetails }
          : {}),
      });

      if (error) {
        setCardError(error.message);
        return null;
      }

      setCardError("");
      return paymentMethod;
    } catch (err) {
      setCardError(err.message || "Payment method creation failed.");
      return null;
    }
  }, [stripe, elements, billingDetails, cardName]);

  // Store function in ref so it's always available
  useEffect(() => {
    createPaymentMethodRef.current = createPaymentMethod;
  }, [createPaymentMethod]);

  // Call the callback whenever the function updates
  useEffect(() => {
    if (onPaymentMethodReady && createPaymentMethodRef.current) {
      onPaymentMethodReady(createPaymentMethodRef.current);
    }
  }, [onPaymentMethodReady]);

  useEffect(() => {
    if (onCardStateChange) {
      onCardStateChange({
        ready: Boolean(stripe && elements),
        complete: isCardComplete && !cardError,
        error: cardError,
      });
    }
  }, [onCardStateChange, stripe, elements, isCardComplete, cardError]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-white/50">Name on Card</label>
        <input
          type="text"
          value={cardName}
          onChange={onCardNameChange}
          placeholder="Alisha Fatima"
          disabled={isProcessing}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-white/50">Card Number</label>
        <div className={inputClass}>
          <CardNumberElement
            options={cardElementOptions}
            onChange={handleCardChange("cardNumberComplete")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs text-white/50">Expiry Date</label>
          <div className={inputClass}>
            <CardExpiryElement
              options={cardElementOptions}
              onChange={handleCardChange("cardExpiryComplete")}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-white/50">CVC</label>
          <div className={inputClass}>
            <CardCvcElement
              options={cardElementOptions}
              onChange={handleCardChange("cardCvcComplete")}
            />
          </div>
        </div>
      </div>

      {cardError && (
        <div className="rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
          {cardError}
        </div>
      )}
    </div>
  );
};

export default StripeCardForm;
