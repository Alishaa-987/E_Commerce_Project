import React, { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formatSellerCurrency } from "../sellerSession";

const ITEMS_PER_PAGE = 10;

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatOptionalAmount = (value) =>
  value === undefined || value === null || value === "" ? "-" : formatSellerCurrency(value);

const SellerDiscountCodesPanel = ({ couponCodes = [], error = "" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(couponCodes.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCoupons = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return couponCodes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [couponCodes, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  if (error && !couponCodes.length) {
    return (
      <div className="rounded-[24px] border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-200 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        {error}
      </div>
    );
  }

  if (!couponCodes.length) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Discount Codes</p>
        <h3 className="mt-3 text-2xl font-Playfair font-semibold text-white">
          No coupon codes yet
        </h3>
        <p className="mt-3 text-sm text-white/50">
          Create your first coupon code to see it listed here in rows.
        </p>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="mb-4 rounded-[24px] border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-200 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111114] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">All Coupons</p>
            <h3 className="mt-2 text-2xl font-Playfair font-semibold text-white">
              Seller coupon list
            </h3>
          </div>
          <p className="text-sm text-white/45">
            Showing {paginatedCoupons.length} of {couponCodes.length} coupon codes
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.03] text-left">
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Coupon Name
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Discount
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Min Amount
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Max Amount
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Selected Product
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Category
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-t border-white/10 align-middle transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                    {coupon.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-emerald-200">{coupon.value}%</td>
                  <td className="px-5 py-4 text-sm text-white/70">
                    {formatOptionalAmount(coupon.minAmount)}
                  </td>
                  <td className="px-5 py-4 text-sm text-white/70">
                    {formatOptionalAmount(coupon.maxAmount)}
                  </td>
                  <td className="px-5 py-4 text-sm text-white/70">
                    {coupon.selectedProductName || "-"}
                  </td>
                  <td className="px-5 py-4 text-sm text-white/70">{coupon.category || "-"}</td>
                  <td className="px-5 py-4 text-sm text-white/50">
                    {formatDate(coupon.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#111114] px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft size={16} />
            Prev
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setCurrentPage(pageNumber)}
              className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition ${
                currentPage === pageNumber
                  ? "border-emerald-300 bg-emerald-300 text-[#0b0b0d]"
                  : "border-white/10 bg-[#111114] text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#111114] px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <FiChevronRight size={16} />
          </button>
        </div>
      ) : null}
    </>
  );
};

export default SellerDiscountCodesPanel;
