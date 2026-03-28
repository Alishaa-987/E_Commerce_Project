import React from "react";
import { FiX } from "react-icons/fi";

const SellerDeleteConfirmModal = ({
  isOpen = false,
  itemName = "",
  itemType = "item",
  isDeleting = false,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close delete confirmation"
        >
          <FiX size={16} />
        </button>

        <h3 className="pr-10 text-2xl font-Playfair font-semibold text-white">
          Delete this {itemType}?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {itemName ? `"${itemName}"` : "This item"} will be removed permanently.
          Uploaded images will be deleted too.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/75 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-300/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDeleteConfirmModal;
