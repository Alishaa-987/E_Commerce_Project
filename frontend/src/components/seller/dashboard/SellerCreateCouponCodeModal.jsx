import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/25 focus:bg-white/[0.05]";

const initialForm = {
  name: "",
  value: "",
  minAmount: "",
  maxAmount: "",
  selectedProductId: "",
  category: "",
};

const SellerCreateCouponCodeModal = ({
  isOpen = false,
  productOptions = [],
  categoryOptions = [],
  onClose,
  onCreateCoupon,
}) => {
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setForm(initialForm);
    setFormError("");
    onClose?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (
      !form.name.trim() ||
      !form.value ||
      !form.selectedProductId ||
      !form.category
    ) {
      setFormError(
        "Name, discount percentage, selected product, and category are required. Min and max amount are optional."
      );
      return;
    }

    const discountPercentage = Number(form.value);
    const minimumAmount = form.minAmount === "" ? undefined : Number(form.minAmount);
    const maximumAmount = form.maxAmount === "" ? undefined : Number(form.maxAmount);

    if (Number.isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100) {
      setFormError("Discount percentage must be between 1 and 100.");
      return;
    }

    if (
      minimumAmount !== undefined &&
      (Number.isNaN(minimumAmount) || minimumAmount < 0)
    ) {
      setFormError("Minimum amount must be 0 or more.");
      return;
    }

    if (
      maximumAmount !== undefined &&
      (Number.isNaN(maximumAmount) || maximumAmount < 0)
    ) {
      setFormError("Maximum amount must be 0 or more.");
      return;
    }

    if (
      minimumAmount !== undefined &&
      maximumAmount !== undefined &&
      maximumAmount < minimumAmount
    ) {
      setFormError("Maximum amount must be greater than or equal to minimum amount.");
      return;
    }

    setIsSubmitting(true);
    const result = await onCreateCoupon?.({
      name: form.name.trim(),
      value: discountPercentage,
      minAmount: minimumAmount,
      maxAmount: maximumAmount,
      selectedProductId: form.selectedProductId,
      category: form.category,
    });
    setIsSubmitting(false);

    if (!result?.success) {
      setFormError(result?.message || "Coupon code could not be created.");
      return;
    }

    setForm(initialForm);
    setFormError("");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#111114] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.65)] lg:p-8">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close create coupon form"
        >
          <FiX size={16} />
        </button>

        <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">Create Coupon</p>
        <h3 className="mt-3 text-3xl font-Playfair font-semibold text-white">
          New discount code
        </h3>
        <p className="mt-3 text-sm text-white/50">
          Add the coupon details below and link it to one of your products.
        </p>
        <p className="mt-2 text-xs text-white/35">
          Required: name, discount percentage, selected product, and category. Min and max
          amount are optional.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter coupon code..."
              />
            </label>

            <label className="space-y-2 text-sm text-white/70">
              Discount Percentage
              <input
                name="value"
                type="number"
                min="1"
                max="100"
                value={form.value}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter discount percentage..."
              />
            </label>

            <label className="space-y-2 text-sm text-white/70">
              Min Amount <span className="text-white/35">(Optional)</span>
              <input
                name="minAmount"
                type="number"
                min="0"
                value={form.minAmount}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter minimum amount..."
              />
            </label>

            <label className="space-y-2 text-sm text-white/70">
              Max Amount <span className="text-white/35">(Optional)</span>
              <input
                name="maxAmount"
                type="number"
                min="0"
                value={form.maxAmount}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter maximum amount..."
              />
            </label>

            <label className="space-y-2 text-sm text-white/70 md:col-span-2">
              Selected Product
              <select
                name="selectedProductId"
                value={form.selectedProductId}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="" className="bg-[#111114]">
                  Select a product
                </option>
                {productOptions.map((product) => (
                  <option key={product.id} value={product.id} className="bg-[#111114]">
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-white/70 md:col-span-2">
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="" className="bg-[#111114]">
                  Select a category
                </option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category} className="bg-[#111114]">
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {formError ? (
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
              {formError}
            </div>
          ) : null}

          {!productOptions.length ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/55">
              Create at least one product first so you can attach a coupon code to it.
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !productOptions.length}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiPlus size={16} />
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerCreateCouponCodeModal;
