import React, { useRef } from "react";
import { FiImage, FiPlus, FiTrash2 } from "react-icons/fi";

const SellerProductImagePicker = ({
  images,
  onImageChange,
  onRemoveImage,
}) => {
  const inputRef = useRef(null);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onImageChange}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] text-white/50 transition hover:border-emerald-300/30 hover:text-emerald-300"
          aria-label="Upload product images"
        >
          <div className="flex flex-col items-center gap-1">
            <FiPlus size={18} />
            <span className="text-[11px] uppercase tracking-[0.18em]">Add</span>
          </div>
        </button>

        {images.map((image) => (
          <div
            key={image.id}
            className="group relative h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            <img
              src={image.preview}
              alt={image.name}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(image.id)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0b0b0d]/85 text-white/75 opacity-0 transition group-hover:opacity-100 hover:text-rose-300"
              aria-label={`Remove ${image.name}`}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-white/40">
        <FiImage size={13} />
        <span>Upload from your local device. First image becomes the cover.</span>
      </div>
    </div>
  );
};

export default SellerProductImagePicker;
