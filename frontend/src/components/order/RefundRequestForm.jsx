
import React, { useState } from "react";

const RefundRequestForm = ({ order, onClose, onRefundRequested }) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for the refund request.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/v2/order/${order._id}/request-refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ reason }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        onRefundRequested && onRefundRequested(data.refund);
      } else {
        setError(data.message || "Failed to submit refund request.");
      }
    } catch (err) {
      setError("Failed to submit refund request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 text-center">
        <div className="text-4xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-amber-200 mb-1">Refund Requested!</h3>
        <p className="text-sm text-white/50">
          Your refund request has been submitted and is pending review.
        </p>
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
        <label htmlFor="refund-reason" className="mb-2 block text-sm font-medium text-white/70">
          Refund Reason
        </label>
        <textarea
          id="refund-reason"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please explain why you're requesting a refund..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-amber-300/50 focus:outline-none focus:ring-1 focus:ring-amber-300/50"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
            submitting
              ? "cursor-not-allowed border-white/10 bg-white/5 text-white/40"
              : "border-amber-300/40 bg-amber-300/10 text-amber-200 hover:bg-amber-300/20"
          }`}
        >
          {submitting ? "Submitting..." : "Submit Refund Request"}
        </button>
      </div>
    </form>
  );
};

export default RefundRequestForm;
