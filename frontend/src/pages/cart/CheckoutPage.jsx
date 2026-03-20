import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiArrowLeft, FiLock } from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../context/CartContext";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: success
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | paypal | cod
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");

  const shipping = cartTotal > 80 ? 0 : 9.99;
  const total = cartTotal + shipping;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleOrder = () => {
    if (paymentMethod === "card") {
      if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv) {
        setError("Please fill card name, number, expiry, and CVV.");
        return;
      }
    }
    setError("");
    clearCart();
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center px-6 pt-16">
          <div className="max-w-md w-full text-center space-y-6 animate-fade-up">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10">
              <FiCheck size={36} className="text-emerald-300" />
            </div>
            <h1 className="text-3xl font-Playfair font-semibold text-white">
              Order confirmed!
            </h1>
            <p className="text-white/50 text-sm leading-relaxed">
              Your order has been placed and is being prepared. You'll receive a confirmation email shortly.
            </p>
            <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 text-left">
              <p className="text-xs text-white/30 mb-3 uppercase tracking-widest">Order summary</p>
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Total paid</span>
                <span className="text-white font-semibold">${total.toFixed(2)}</span>
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
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                  Shipping Address
                </p>
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
                  <label className="text-xs text-white/50">Street Address</label>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street" className={inputClass} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50">City</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="New York" className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50">ZIP Code</label>
                    <input name="zip" value={form.zip} onChange={handleChange} placeholder="10001" className={inputClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50">Country</label>
                    <input name="country" value={form.country} onChange={handleChange} placeholder="USA" className={inputClass} />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
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
                    { key: "paypal", label: "Pay with Paypal" },
                    { key: "cod", label: "Cash on Delivery" },
                  ].map((m) => (
                    <div
                      key={m.key}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.key}
                        checked={paymentMethod === m.key}
                        onChange={() => setPaymentMethod(m.key)}
                        className="mt-1 accent-emerald-300"
                      />
                      <div className="flex-1 text-sm text-white/80">{m.label}</div>
                    </div>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50">Card Number</label>
                        <input
                          name="cardNumber"
                          value={form.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50">Exp Date</label>
                        <input
                          name="expiry"
                          value={form.expiry}
                          onChange={handleChange}
                          placeholder="MM / YY"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50">Name on Card</label>
                        <input
                          name="cardName"
                          value={form.cardName}
                          onChange={handleChange}
                          placeholder="Alisha Fatima"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50">Billing Address</label>
                        <input
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="123 Main Street"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleOrder}
                      className="w-full rounded-xl bg-emerald-300 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
                    >
                      Submit
                    </button>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    You will be redirected to PayPal to complete your purchase.
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    Pay in cash upon delivery. Please ensure the address above is correct.
                  </div>
                )}

                {error && <p className="text-sm text-red-300">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-xl border border-white/15 py-3 text-sm text-white/60 hover:text-white transition"
                  >
                    &larr; Back
                  </button>
                  {paymentMethod !== "card" && (
                    <button
                      onClick={handleOrder}
                      className="flex-1 rounded-xl bg-emerald-300 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
                    >
                      Confirm | ${total.toFixed(2)}
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
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 truncate">{item.name}</p>
                      <p className="text-[10px] text-white/30">x{item.qty}</p>
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
                <div className="flex justify-between font-semibold text-white pt-1 border-t border-white/10">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition"
                />
                <button className="w-full rounded-xl border border-pink-300 text-pink-200 py-3 text-sm font-semibold hover:bg-pink-300/10 transition">
                  Apply code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
