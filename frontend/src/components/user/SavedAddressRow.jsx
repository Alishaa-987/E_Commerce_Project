import React from "react";
import { FiCheck, FiEdit2, FiMapPin, FiTrash2 } from "react-icons/fi";

const SavedAddressRow = ({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  primaryActionLabel = "Choose",
  showPrimaryAction = false,
  isDeleting = false,
  deleteDisabled = false,
}) => {
  const isClickable = Boolean(showPrimaryAction && onSelect);
  const heading = address.isDefault ? "Default" : address.addressType;
  const subheading = address.isDefault && address.addressType !== "Default"
    ? address.addressType
    : null;
  const addressLine = [address.address1, address.address2, address.city]
    .filter(Boolean)
    .join(" ");
  const metaLine = [address.country, address.zipCode].filter(Boolean).join(" | ");

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-pressed={isClickable ? isSelected : undefined}
      onClick={isClickable ? () => onSelect(address) : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(address);
              }
            }
          : undefined
      }
      className={`grid gap-4 rounded-2xl border px-4 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.22)] transition md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center ${
        isSelected
          ? "border-emerald-300/35 bg-emerald-300/10"
          : "border-white/10 bg-[#0f0f12]"
      } ${isClickable ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
            isSelected
              ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
              : "border-white/10 bg-white/[0.04] text-white/55"
          }`}
        >
          <FiMapPin size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{heading}</p>
          {subheading ? (
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
              {subheading}
            </p>
          ) : null}
        </div>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white/85">{addressLine}</p>
        <p className="mt-1 text-xs text-white/45">{metaLine}</p>
      </div>

      <div className="flex items-center gap-2 md:justify-end">
        {showPrimaryAction ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect?.(address);
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              isSelected
                ? "border border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                : "border border-white/10 bg-white/5 text-white/75 hover:border-white/25 hover:text-white"
            }`}
          >
            {isSelected ? <FiCheck size={13} /> : null}
            {isSelected ? "Selected" : primaryActionLabel}
          </button>
        ) : null}

        {onEdit ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.(address);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/45 transition hover:border-white/25 hover:text-white"
            aria-label="Edit address"
          >
            <FiEdit2 size={15} />
          </button>
        ) : null}

        {onDelete ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(address);
            }}
            disabled={isDeleting || deleteDisabled}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/45 transition hover:border-rose-300/30 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Delete address"
          >
            <FiTrash2 size={15} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SavedAddressRow;
