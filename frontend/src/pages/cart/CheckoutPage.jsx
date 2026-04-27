import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiArrowLeft, FiLock, FiLoader } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import AddressModal from "../../components/user/AddressModal";
import SavedAddressRow from "../../components/user/SavedAddressRow";
import StripeCardForm from "../../components/payment/StripeCardForm";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../context/CartContext";
import { addUserAddress } from "../../redux/actions/user";
import { processPayment } from "../../redux/actions/payment";
import { createOrder } from "../../redux/actions/order";
import { server } from "../../server";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition";

const getCartItemId = (item = {}) => String(item?.id || item?._id || "").trim();
const splitUserName = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
const fillAddressFields = (currentForm, address, contactDefaults) => {
  // Directly use address object without nested property assumption
  if (!address) {
    return currentForm;
  }

  // Helper to get non-empty value from address, fallback to contactDefaults
  const getAddressField = (addressValue, contactValue = "") => {
    const trimmed = String(addressValue || "").trim();
    return trimmed || contactValue || "";
  };

  return {
    ...currentForm,
    // Fill contact fields from address, with fallback to contactDefaults
    firstName: getAddressField(address.firstName, contactDefaults.firstName),
    lastName: getAddressField(address.lastName, contactDefaults.lastName),
    email: getAddressField(address.email, contactDefaults.email),
    phone: getAddressField(address.phone, contactDefaults.phone),
    // Fill address fields from address object
    address1: getAddressField(address.address1),
    address2: getAddressField(address.address2),
    city: getAddressField(address.city || address.state),
    country: getAddressField(address.country || address.countryName),
    countryCode: getAddressField(address.countryCode || address.country_iso_code),
    zipCode: getAddressField(address.zipCode || address.postalCode || address.zip),
    // Preserve payment fields from current form
    cardNumber: currentForm.cardNumber || "",
    expiry: currentForm.expiry || "",
    cvv: currentForm.cvv || "",
    cardName: currentForm.cardName || "",
  };
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, addressActionLoading } = useSelector((state) => state.user);
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: success
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
    countryCode: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | paypal | cod
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");
  const [couponFeedback, setCouponFeedback] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponDetails, setCouponDetails] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardState, setCardState] = useState({
    ready: false,
    complete: false,
    error: "",
  });
  const createPaymentMethodFnRef = useRef(null);

  const savedAddresses = useMemo(() => user?.addresses || [], [user?.addresses]);
  const contactDefaults = useMemo(() => {
    const userNameParts = splitUserName(user?.name);

    return {
      firstName: userNameParts[0] || "",
      lastName: userNameParts.slice(1).join(" "),
      email: user?.email || "",
      phone: user?.phoneNumber || "",
    };
  }, [user?.email, user?.name, user?.phoneNumber]);

  const shipping = cartTotal > 80 ? 0 : 9.99;
  const couponDiscount = Number(couponDetails?.discountAmount || 0);
  const total = Math.max(cartTotal + shipping - couponDiscount, 0);
  const hasCardholderName = Boolean(form.cardName.trim());
  const canSubmitCardPayment =
    total <= 0
      ? !isProcessingPayment
      : hasCardholderName &&
        cardState.ready &&
        cardState.complete &&
        !isProcessingPayment;

  useEffect(() => {
    setForm((current) => ({
      ...current,
      // Only fill from contactDefaults if form field is empty/whitespace
      firstName: current.firstName?.trim() ? current.firstName : contactDefaults.firstName,
      lastName: current.lastName?.trim() ? current.lastName : contactDefaults.lastName,
      email: current.email?.trim() ? current.email : contactDefaults.email,
      phone: current.phone?.trim() ? current.phone : contactDefaults.phone,
    }));
  }, [contactDefaults.firstName, contactDefaults.lastName, contactDefaults.email, contactDefaults.phone]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCouponChange = (event) => {
    const nextCoupon = event.target.value;

    setCoupon(nextCoupon);
    setCouponError("");

    if (couponDetails && nextCoupon.trim().toUpperCase() !== couponDetails.name) {
      setCouponDetails(null);
      setCouponFeedback("");
    }
  };

  const applySavedAddress = (address) => {
    setSelectedAddressId(address?._id || "");
    setForm((current) => fillAddressFields(current, address, contactDefaults));
    setShowSavedAddresses(false);
    setAddressMessage("Address applied.");
  };

  useEffect(() => {
    if (!addressMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setAddressMessage("");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [addressMessage]);

  useEffect(() => {
    if (!couponFeedback) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCouponFeedback("");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [couponFeedback]);

  useEffect(() => {
    if (!couponError) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCouponError("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [couponError]);

  const handleCreateAddress = async (addressData) => {
    const result = await dispatch(addUserAddress(addressData));

    if (result?.success) {
      const nextAddresses = result.user?.addresses || [];
      const createdAddress =
        (addressData.addressType === "Default"
          ? nextAddresses.find((address) => address.isDefault)
          : [...nextAddresses].reverse().find(
              (address) =>
                address.countryCode === addressData.countryCode &&
                address.city === addressData.city &&
                address.address1 === addressData.address1 &&
                address.zipCode === addressData.zipCode
            )) || nextAddresses[nextAddresses.length - 1];
      if (createdAddress) {
        applySavedAddress(createdAddress);
      }
      setAddressMessage("Address saved.");
    }

    return result;
  };

  const handleApplyCoupon = async () => {
    const normalizedCoupon = coupon.trim().toUpperCase();

    if (!normalizedCoupon) {
      setCouponDetails(null);
      setCouponFeedback("");
      setCouponError("Please enter a coupon code.");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      setCouponFeedback("");

      const { data } = await axios.post(
        `${server}/coupon/validate-coupon`,
        {
          name: normalizedCoupon,
          cartItems,
        },
        {
          withCredentials: true,
        }
      );

      setCoupon(normalizedCoupon);
      setCouponDetails({
        ...data.coupon,
        discountAmount: data.discountAmount,
      });
      setCouponFeedback("Coupon applied.");
    } catch (couponApplyError) {
      setCouponDetails(null);
      setCouponFeedback("");
      setCouponError(
        couponApplyError.response?.data?.message || "Coupon code could not be applied."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleContinueToPayment = () => {
    const missing = [];
    if (!form.firstName.trim()) missing.push("first name");
    if (!form.lastName.trim()) missing.push("last name");
    if (!form.email.trim()) missing.push("email");
    if (!form.phone.trim()) missing.push("phone");
    if (!form.address1.trim()) missing.push("address");
    if (!form.city.trim()) missing.push("city");
    if (!form.country.trim()) missing.push("country");
    if (!form.zipCode.trim()) missing.push("zip code");
    
    if (missing.length > 0) {
      setError(`Please complete: ${missing.join(", ")}`);
      return;
    }

    setError("");
    setStep(2);
  };

  const buildShippingAddress = () => ({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    address1: form.address1.trim(),
    address2: form.address2.trim(),
    city: form.city.trim(),
    country: form.country.trim(),
    countryCode: form.countryCode.trim(),
    zipCode: form.zipCode.trim(),
  });

  const normalizeOrderCartItems = (items = []) =>
    (Array.isArray(items) ? items : []).map((item) => {
      const derivedShopId = String(item?.shopId || item?.shop?._id || item?.shop?.id || "").trim();
      const derivedShop =
        item?.shop && typeof item.shop === "object"
          ? item.shop
          : derivedShopId || item?.shopName
            ? {
                _id: derivedShopId,
                id: derivedShopId,
                name: item?.shopName || "",
                handle: item?.shopHandle || "",
                avatar: item?.shopAvatar || "",
              }
            : undefined;

      return {
        ...item,
        shopId: derivedShopId || item?.shopId,
        shop: derivedShop,
      };
    });

  const buildOrderData = (paymentInfo, selectedPaymentMethod = paymentMethod) => ({
    cart: normalizeOrderCartItems(cartItems),
    shippingAddress: buildShippingAddress(),
    paymentInfo,
    totalPrice: total,
    paymentMethod: selectedPaymentMethod,
  });

  const finalizeOrder = async (orderData) => {

    const orderResult = await dispatch(createOrder(orderData));

    if (orderResult.success) {
      setConfirmedTotal(total);
      setConfirmedPaymentMethod(orderData?.paymentMethod || paymentMethod);
      clearCart();
      setStep(3);
      return true;
    }

    setError(orderResult.message || "Order creation failed.");
    return false;
  };

  const handleOrder = async () => {

    if (paymentMethod === "card") {
      // Handle Stripe card payment
      if (total <= 0) {
        setIsProcessingPayment(true);
        setError("");

        try {
          await finalizeOrder(
            buildOrderData(
              {
                id: "",
                status: "succeeded",
                type: "card",
                stripePaymentIntentId: "",
              },
              "card"
            )
          );
        } catch (err) {
          setError(err.message || "Order creation failed.");
        } finally {
          setIsProcessingPayment(false);
        }
        return;
      }

      if (!form.cardName || !form.cardName.trim()) {
        setError("Please enter the cardholder name.");
        return;
      }

      if (!stripe || !elements) {
        setError("Payment system not ready. Please refresh and try again.");
        return;
      }

      if (!createPaymentMethodFnRef.current || typeof createPaymentMethodFnRef.current !== "function") {
        setError("Card information is not ready. Please try again.");
        return;
      }

      if (!cardState.ready) {
        setError("Card form is still loading. Please wait a moment and try again.");
        return;
      }

      if (!cardState.complete) {
        setError(cardState.error || "Please complete your card details.");
        return;
      }

      setIsProcessingPayment(true);
      setError("");

      try {
        // Step 1: Create Stripe payment intent
        const amountInCents = Math.round(total * 100);
        const paymentResponse = await dispatch(
          processPayment({
            amount: amountInCents,
            cart: cartItems,
            shippingAmount: shipping,
            couponDiscount,
            totalPrice: total,
            currency: "usd",
          })
        );

        if (!paymentResponse.success) {
          setError(paymentResponse.message || "Payment processing failed.");
          setIsProcessingPayment(false);
          return;
        }

        const clientSecret = paymentResponse.clientSecret;
        if (!clientSecret) {
          setError("Payment session could not be created. Please try again.");
          setIsProcessingPayment(false);
          return;
        }

        // Step 2: Create payment method
        let stripePaymentMethod;
        try {
          stripePaymentMethod = await createPaymentMethodFnRef.current();
        } catch (pmError) {
          setError(pmError.message || "Failed to create payment method.");
          setIsProcessingPayment(false);
          return;
        }

        if (!stripePaymentMethod) {
          setError("Card validation failed. Please check your card details.");
          setIsProcessingPayment(false);
          return;
        }

        // Step 3: Confirm payment with Stripe
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: stripePaymentMethod.id,
          }
        );

        if (confirmError) {
          setError(confirmError.message);
          setIsProcessingPayment(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          await finalizeOrder(
            buildOrderData(
              {
                id: paymentIntent.id,
                status: paymentIntent.status,
                type: "card",
                stripePaymentIntentId: paymentIntent.id,
              },
              "card"
            )
          );
        } else {
          setError(`Payment failed with status: ${paymentIntent.status}`);
        }
      } catch (err) {
        setError(err.message || "Payment processing failed. Please try again.");
      } finally {
        setIsProcessingPayment(false);
      }
    } else if (paymentMethod === "cod") {
      // Handle COD orders without online payment capture.
      try {
        setIsProcessingPayment(true);
        await finalizeOrder(
          buildOrderData(
            {
              id: "",
              status: total > 0 ? "pending" : "succeeded",
              type: paymentMethod,
              stripePaymentIntentId: "",
            },
            paymentMethod
          )
        );
      } catch (err) {
        setError(err.message || "Order creation failed.");
      } finally {
        setIsProcessingPayment(false);
      }
    } else {
      setError("PayPal integration is not connected yet. Please use card or cash on delivery.");
    }
  };

  if (step === 3) {
    const isCashOnDelivery = confirmedPaymentMethod === "cod";

    return (
      <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center px-6 pt-16">
          <div className="max-w-md w-full text-center space-y-6 animate-fade-up">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10">
              <FiCheck size={36} className="text-emerald-300" />
            </div>
            <h1 className="text-3xl font-Playfair font-semibold text-white">
              {isCashOnDelivery ? "Order placed!" : "Order confirmed!"}
            </h1>
            <p className="text-white/50 text-sm leading-relaxed">
              {isCashOnDelivery
                ? "Your cash on delivery order has been placed. Please keep the amount ready when your package arrives."
                : "Your order has been placed and is being prepared. You'll receive a confirmation email shortly."}
            </p>
            <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 text-left">
              <p className="text-xs text-white/30 mb-3 uppercase tracking-widest">Order summary</p>
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>{isCashOnDelivery ? "Amount due on delivery" : "Total paid"}</span>
                <span className="text-white font-semibold">${confirmedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Payment method</span>
                <span className="text-white font-semibold">
                  {isCashOnDelivery ? "Cash on Delivery" : "Card"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Estimated delivery</span>
                <span>3-5 business days</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/profile?tab=orders"
                className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
              >
                Track your order
              </Link>
              <Link
                to="/"
                className="w-full rounded-xl border border-white/15 py-3 text-sm text-white/70 hover:text-white transition"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        <div className="mb-8">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition mb-4"
          >
            <FiArrowLeft size={12} /> Back to cart
          </Link>
          <h1 className="text-3xl font-Playfair font-semibold text-white">Checkout</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-10">
          {["Shipping", "Payment"].map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                      isDone
                        ? "bg-emerald-300 text-[#0b0b0d]"
                        : isActive
                        ? "bg-white text-[#0b0b0d]"
                        : "border border-white/20 text-white/30"
                    }`}
                  >
                    {isDone ? <FiCheck size={12} /> : stepNum}
                  </div>
                  <span
                    className={`text-sm ${
                      isActive ? "text-white font-medium" : "text-white/30"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < 1 && <div className="flex-1 h-px bg-white/10" />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 sm:p-8 space-y-5 animate-fade-up">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                    Shipping Address
                  </p>
                  <h2 className="text-xl font-Playfair font-semibold text-white">
                    Delivery details
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50">First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Alisha" className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50">Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Fatima" className={inputClass} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-white/50">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-white/50">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-white/50">Address 1</label>
                  <input name="address1" value={form.address1} onChange={handleChange} placeholder="851 SE 6th Avenue #101" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-white/50">Address 2</label>
                  <input name="address2" value={form.address2} onChange={handleChange} placeholder="Delray Beach" className={inputClass} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50">City</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="New York" className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50">ZIP Code</label>
                    <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="10001" className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50">Country</label>
                    <input name="country" value={form.country} onChange={handleChange} placeholder="USA" className={inputClass} />
                  </div>
                </div>
                {addressMessage ? (
                  <p className="text-sm text-emerald-300">{addressMessage}</p>
                ) : null}
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b0b0d] transition hover:-translate-y-0.5"
                  >
                    Add address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSavedAddresses((current) => !current)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:border-white/25 hover:text-white"
                  >
                    Choose from saved address
                  </button>
                </div>
                {showSavedAddresses ? (
                  <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0f0f12] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                        Saved addresses
                      </p>
                      <span className="text-xs text-white/35">
                        {savedAddresses.length} saved
                      </span>
                    </div>
                    {savedAddresses.length ? (
                      savedAddresses.map((address) => (
                        <SavedAddressRow
                          key={address._id}
                          address={address}
                          isSelected={selectedAddressId === address._id}
                          showPrimaryAction
                          primaryActionLabel="Use address"
                          onSelect={applySavedAddress}
                        />
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/55">
                        No saved addresses yet. Add one and it will appear here.
                      </div>
                    )}
                  </div>
                ) : null}
                {error ? <p className="text-sm text-red-300">{error}</p> : null}
                <button
                  onClick={handleContinueToPayment}
                  className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5 mt-2"
                >
                  Continue to Payment ->
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 sm:p-8 space-y-6 animate-fade-up">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-white/30">
                    Payment
                  </p>
                  <div className="flex items-center gap-2 text-white/30 text-xs">
                    <FiLock size={12} className="text-emerald-300" />
                    Secure checkout | TLS 1.2
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "card", label: "Pay with Debit/credit card" },
                    {
                      key: "paypal",
                      label: "Pay with PayPal",
                      helper: "Coming soon",
                      disabled: true,
                    },
                    { key: "cod", label: "Cash on Delivery" },
                  ].map((m) => (
                    <div
                      key={m.key}
                      className={`flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 ${
                        m.disabled ? "opacity-55" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.key}
                        checked={paymentMethod === m.key}
                        onChange={() => {
                          if (!m.disabled) {
                            setPaymentMethod(m.key);
                            setError("");
                          }
                        }}
                        disabled={m.disabled}
                        className="mt-1 accent-emerald-300"
                      />
                      <div className="flex flex-1 items-center justify-between gap-3">
                        <div className="text-sm text-white/80">{m.label}</div>
                        {m.helper ? (
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
                            {m.helper}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-white/45">
                  PayPal abhi connected nahi hai. Card aur cash on delivery checkout ready hain.
                </p>

                {paymentMethod === "card" && (
                  <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <StripeCardForm
                      cardName={form.cardName}
                      billingDetails={{
                        email: form.email,
                        phone: form.phone,
                        address1: form.address1,
                        address2: form.address2,
                        city: form.city,
                        country: form.country,
                        countryCode: form.countryCode,
                        zipCode: form.zipCode,
                      }}
                      onCardNameChange={(e) =>
                        setForm((f) => ({ ...f, cardName: e.target.value }))
                      }
                      onCardStateChange={setCardState}
                      onPaymentMethodReady={(fn) => {
                        createPaymentMethodFnRef.current = fn;
                      }}
                      isProcessing={isProcessingPayment}
                    />
                    {!cardState.complete && !cardState.error ? (
                      <p className="text-xs text-white/40">
                        Enter your card details to activate secure payment.
                      </p>
                    ) : null}
                    <button
                      onClick={handleOrder}
                      disabled={!canSubmitCardPayment}
                      className="w-full rounded-xl bg-emerald-300 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessingPayment && <FiLoader size={16} className="animate-spin" />}
                      {isProcessingPayment ? "Processing Payment..." : "Pay Now"}
                    </button>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    PayPal integration is coming soon. Please use card or cash on delivery for now.
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    Pay in cash upon delivery. Please ensure the address above is correct and keep the order amount ready when it arrives.
                  </div>
                )}

                {error && <p className="text-sm text-red-300">{error}</p>}

                <div className="flex gap-3 pt-2">
                   <button
                     onClick={() => setStep(1)}
                     disabled={isProcessingPayment}
                     className="flex-1 rounded-xl border border-white/15 py-3 text-sm text-white/60 hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                   >
                     &larr; Back
                   </button>
                   {paymentMethod !== "card" && (
                     <button
                       onClick={handleOrder}
                       disabled={isProcessingPayment}
                       className="flex-1 rounded-xl bg-emerald-300 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                     >
                       {isProcessingPayment && <FiLoader size={14} className="animate-spin" />}
                       {isProcessingPayment
                         ? "Processing..."
                         : paymentMethod === "cod"
                         ? `Place COD Order | $${total.toFixed(2)}`
                         : `Confirm | $${total.toFixed(2)}`}
                     </button>
                   )}
                 </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#111114] p-5">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">
                Your order
              </p>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={getCartItemId(item) || item.name} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 truncate">{item.name}</p>
                      <p className="text-[10px] text-white/30">x{item.qty}</p>
                      {couponDetails?.selectedProductId === getCartItemId(item) ? (
                        <p className="text-[10px] text-emerald-300">
                          {couponDetails.name} applied on this item
                        </p>
                      ) : null}
                    </div>
                    <span className="text-xs font-medium text-white shrink-0">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-300" : ""}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {couponDetails ? (
                  <div className="flex justify-between text-emerald-200">
                    <span>
                      {couponDetails.name} on {couponDetails.selectedProductName}
                    </span>
                    <span>- ${couponDiscount.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between font-semibold text-white pt-1 border-t border-white/10">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <input
                  value={coupon}
                  onChange={handleCouponChange}
                  placeholder="Coupon code"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="w-full rounded-xl border border-pink-300 text-pink-200 py-3 text-sm font-semibold hover:bg-pink-300/10 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {couponLoading ? "Applying..." : "Apply code"}
                </button>
                {couponError ? (
                  <p className="text-sm text-rose-300">{couponError}</p>
                ) : null}
                {!couponError && couponFeedback ? (
                  <p className="text-sm text-emerald-300">{couponFeedback}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AddressModal
        isOpen={isAddressModalOpen}
        isSubmitting={addressActionLoading}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmitAddress={handleCreateAddress}
      />
    </div>
  );
};

export default CheckoutPage;