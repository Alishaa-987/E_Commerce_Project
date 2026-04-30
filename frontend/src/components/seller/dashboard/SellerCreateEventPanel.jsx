import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { createEvent } from "../../../redux/actions/event";
import SellerProductImagePicker from "./SellerProductImagePicker";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/25 focus:bg-white/[0.05]";

const createImagePreviewItems = async (files) => {
  const selectedFiles = Array.from(files);

  return Promise.all(
    selectedFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: `${Date.now()}-${file.name}-${Math.random()}`,
              name: file.name,
              file,
              preview: reader.result,
            });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );
};

const addDays = (dateString, days) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const today = new Date().toISOString().split("T")[0];

const SellerCreateEventPanel = ({ sellerShop, onEventCreated }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    couponCode: "",
    originalPrice: "",
    price: "",
    stock: "",
    startDate: "",
    endDate: "",
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tagPreview = useMemo(
    () =>
      form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags]
  );
  const minEndDate = useMemo(
    () => addDays(form.startDate || today, 3),
    [form.startDate]
  );

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      navigate("/seller/events");
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => {
      const next = { ...current, [name]: value };

      if (name === "startDate" && next.endDate && next.endDate < addDays(value, 3)) {
        next.endDate = "";
      }

      return next;
    });
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (!files?.length) {
      return;
    }

    try {
      const previews = await createImagePreviewItems(files);
      setImages((current) => [...current, ...previews].slice(0, 5));
      setError("");
    } catch {
      setError("Images could not be loaded. Try another file.");
    } finally {
      e.target.value = "";
    }
  };

  const handleRemoveImage = (imageId) => {
    setImages((current) => current.filter((image) => image.id !== imageId));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: "",
      tags: "",
      couponCode: "",
      originalPrice: "",
      price: "",
      stock: "",
      startDate: "",
      endDate: "",
    });
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.category.trim() ||
      !form.price ||
      !form.stock ||
      !form.startDate ||
      !form.endDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!images.length) {
      setError("Please upload at least one event image.");
      return;
    }

    const originalPrice = form.originalPrice ? Number(form.originalPrice) : null;
    const discountedPrice = Number(form.price);
    const stock = Number(form.stock);

    if (Number.isNaN(discountedPrice) || discountedPrice <= 0) {
      setError("Event price must be greater than 0.");
      return;
    }

    if (originalPrice !== null && (Number.isNaN(originalPrice) || originalPrice <= 0)) {
      setError("Original price must be empty or greater than 0.");
      return;
    }

    if (originalPrice && discountedPrice > originalPrice) {
      setError("Discount price should not be higher than original price.");
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      setError("Stock must be 0 or more.");
      return;
    }

    if (form.endDate < minEndDate) {
      setError("End date must be at least 3 days after the start date.");
      return;
    }

    const sellerId =
      (typeof window !== "undefined" && window.localStorage.getItem("sellerId")) ||
      sellerShop?._id ||
      sellerShop?.id;

    if (!sellerId) {
      setError("Seller account id is missing. Please log in again.");
      return;
    }

    const newForm = new FormData();
    images.forEach((image) => {
      newForm.append("images", image.file);
    });
    newForm.append("name", form.name.trim());
    newForm.append("description", form.description.trim());
    newForm.append("category", form.category.trim());
    newForm.append("tags", tagPreview.join(","));
    if (form.couponCode.trim()) {
      newForm.append("couponCode", form.couponCode.trim());
    }
    if (form.originalPrice) {
      newForm.append("orignalPrice", form.originalPrice);
    }
    newForm.append("discountPrice", form.price);
    newForm.append("stock", form.stock);
    newForm.append("shopId", sellerId);
    newForm.append("startDate", form.startDate);
    newForm.append("endDate", form.endDate);

    setIsSubmitting(true);
    const result = await dispatch(createEvent(newForm));
    setIsSubmitting(false);

    if (!result?.success) {
      setError(result?.message || "Event could not be created.");
      return;
    }

    onEventCreated?.();
    setSuccess("Event created successfully. Redirecting to events...");
    resetForm();
  };

  return (
    <div className="mx-auto max-w-4xl rounded-[30px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:p-8">
      <div className="mb-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">
          Create Event
        </p>
        <h2 className="mt-3 text-3xl font-Playfair font-semibold text-white">
          Launch a new campaign
        </h2>
        <p className="mt-3 text-sm text-white/50">
          Use the same structure as a product listing, then add the campaign window.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/70 md:col-span-2">
            Name <span className="text-rose-300">*</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter your event name..."
            />
          </label>

          <label className="space-y-2 text-sm text-white/70 md:col-span-2">
            Description <span className="text-rose-300">*</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className={inputClass}
              placeholder="Describe the event offer and campaign details..."
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            Category <span className="text-rose-300">*</span>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter event category..."
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            Tags
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter event tags..."
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            Coupon Code
            <input
              name="couponCode"
              value={form.couponCode}
              onChange={handleChange}
              className={inputClass}
              placeholder="Optional coupon code..."
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            Original Price
            <input
              name="originalPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.originalPrice}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter original event price..."
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            Price (With Discount) <span className="text-rose-300">*</span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter discounted event price..."
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            Event Stock <span className="text-rose-300">*</span>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter event stock..."
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            Start Date <span className="text-rose-300">*</span>
            <input
              name="startDate"
              type="date"
              min={today}
              value={form.startDate}
              onChange={handleChange}
              className={inputClass}
            />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            End Date <span className="text-rose-300">*</span>
            <input
              name="endDate"
              type="date"
              min={minEndDate}
              value={form.endDate}
              onChange={handleChange}
              className={inputClass}
            />
            <p className="text-xs text-white/35">
              End date must be at least 3 days after the start date.
            </p>
          </label>

          <div className="space-y-2 text-sm text-white/70 md:col-span-2">
            <span>
              Upload Images <span className="text-rose-300">*</span>
            </span>
            <SellerProductImagePicker
              images={images}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        </div>

        {tagPreview.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tagPreview.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/55"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-200">
            <FiCheckCircle size={16} />
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default SellerCreateEventPanel;
