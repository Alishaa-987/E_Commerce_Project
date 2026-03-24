import React from "react";
import {
  FiCalendar,
  FiEdit3,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
} from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

const SellerProfileSidebar = ({
  sellerShop,
  sellerAvatar,
  storedEmail,
  shopMeta,
  sellerProductCount,
  averageRating,
  onEditShop,
  onLogout,
}) => {
  return (
    <aside className="rounded-[30px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:p-7">
      <div className="flex flex-col items-center text-center">
        <img
          src={sellerAvatar}
          alt={sellerShop.name}
          className="h-28 w-28 rounded-full border border-white/10 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
        />
        <h1 className="mt-5 text-3xl font-Playfair font-semibold text-white">
          {sellerShop.name}
        </h1>
        <p className="mt-2 text-sm text-white/50">{storedEmail}</p>
      </div>

      <div className="mt-8 space-y-5">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/30">Address</p>
          <div className="flex items-start gap-3 text-sm text-white/65">
            <FiMapPin size={15} className="mt-0.5 text-emerald-300" />
            <span>{shopMeta.address}</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/30">Phone Number</p>
          <div className="flex items-center gap-3 text-sm text-white/65">
            <FiPhone size={15} className="text-emerald-300" />
            <span>{shopMeta.phone}</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/30">Contact Email</p>
          <div className="flex items-center gap-3 text-sm text-white/65">
            <FiMail size={15} className="text-emerald-300" />
            <span>{storedEmail}</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/30">Total Products</p>
          <div className="flex items-center gap-3 text-sm text-white/65">
            <FiPackage size={15} className="text-emerald-300" />
            <span>{sellerProductCount}</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/30">Shop Ratings</p>
          <div className="flex items-center gap-3 text-sm text-white/65">
            <AiFillStar size={15} className="text-emerald-300" />
            <span>{averageRating}/5</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/30">Joined On</p>
          <div className="flex items-center gap-3 text-sm text-white/65">
            <FiCalendar size={15} className="text-emerald-300" />
            <span>{shopMeta.joinedOn}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={onEditShop}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
        >
          <FiEdit3 size={15} />
          Edit Shop
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/75 transition hover:border-white/20 hover:text-white"
        >
          <FiLogOut size={15} />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default SellerProfileSidebar;
