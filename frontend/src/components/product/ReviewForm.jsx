import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { server } from "../../server";

const ReviewForm = ({ product, orderId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!message.trim()) {
      setError("Please enter your review.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${server}/product/submit-review`,
        {
          productId: product._id || product.id,
          rating,
          message,
          orderId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        setSubmitted(true);
        onReviewAdded && onReviewAdded(data.review);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
        <div className="text-4xl mb-2">✓</div>
        <h3 className="text-lg font-semibold text-emerald-200 mb-1">Review Submitted!</h3>
        <p className="text-sm text-white/50">Thank you for your feedback.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-rose-300/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-white/70">
          Your Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-1 transition-colors focus:outline-none"
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            >
              {(hover || rating) >= star ? (
                <AiFillStar size={24} className="text-emerald-300" />
              ) : (
                <AiOutlineStar size={24} className="text-white/20" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review-message" className="mb-2 block text-sm font-medium text-white/70">
          Your Review
        </label>
        <textarea
          id="review-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-300/50 focus:outline-none focus:ring-1 focus:ring-emerald-300/50"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${
          submitting
            ? "cursor-not-allowed border-white/10 bg-white/5 text-white/40"
            : "border-emerald-300/40 bg-emerald-300/10 text-emerald-200 hover:bg-emerald-300/20"
        }`}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;