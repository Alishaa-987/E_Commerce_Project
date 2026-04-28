import React, { useEffect, useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { formatSellerCurrency } from "../sellerSession";

const EVENTS_PER_PAGE = 10;

const statusClasses = {
  Live: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Running: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Scheduled: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  Ended: "border-white/15 bg-white/5 text-white/65",
  Expired: "border-rose-300/30 bg-rose-300/10 text-rose-200",
  Draft: "border-amber-300/30 bg-amber-300/10 text-amber-200",
};

const formatDate = (value) => {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const SellerDashboardEventsPanel = ({
  sellerEvents = [],
  error = "",
  onDeleteEvent,
  isDeletingEvent = false,
  deletingEventId = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [previewEvent, setPreviewEvent] = useState(null);

  const totalPages = Math.max(1, Math.ceil(sellerEvents.length / EVENTS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!previewEvent) {
      return;
    }

    const previewStillExists = sellerEvents.some((event) => event.id === previewEvent.id);

    if (!previewStillExists) {
      setPreviewEvent(null);
    }
  }, [previewEvent, sellerEvents]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    return sellerEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);
  }, [currentPage, sellerEvents]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  if (error && !sellerEvents.length) {
    return (
      <div className="rounded-[28px] border border-rose-300/20 bg-rose-300/10 p-6 text-sm text-rose-200 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        {error}
      </div>
    );
  }

  if (!sellerEvents.length) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">All Events</p>
        <h3 className="mt-3 text-2xl font-Playfair font-semibold text-white">
          No events yet
        </h3>
        <p className="mt-3 text-sm text-white/50">
          Your campaigns will appear here once you create your first event.
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
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">All Events</p>
            <h3 className="mt-2 text-2xl font-Playfair font-semibold text-white">
              Seller event list
            </h3>
          </div>
          <p className="text-sm text-white/45">
            Showing {paginatedEvents.length} of {sellerEvents.length} events
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.03] text-left">
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Event ID
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Name
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Price
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Stock
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Status
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Preview
                </th>
                <th className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-white/10 align-middle transition hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-4 text-sm text-white/70">
                    <div className="max-w-[190px] break-all font-mono text-xs text-white/65">
                      {event._id || event.id}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-[#18181b] p-2">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.18em] text-white/30">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{event.name}</p>
                        <p className="mt-1 text-xs text-white/40">{event.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">
                    {formatSellerCurrency(event.price)}
                  </td>
                  <td className="px-5 py-4 text-sm text-white/70">{event.stock}</td>
                  <td className="px-5 py-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                          statusClasses[event.status] || statusClasses.Draft
                        }`}
                      >
                        {event.status}
                      </span>
                      <p className="text-xs text-white/40">{event.window}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setPreviewEvent(event)}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-300/20"
                    >
                      <FiEye size={14} />
                      Preview
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onDeleteEvent?.(event.id, event.name)}
                      disabled={isDeletingEvent && deletingEventId === event.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-300/30 bg-rose-300/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiTrash2 size={14} />
                      {isDeletingEvent && deletingEventId === event.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
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

      {previewEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-[30px] border border-white/10 bg-[#111114] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
            <button
              type="button"
              onClick={() => setPreviewEvent(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:text-white"
              aria-label="Close preview"
            >
              <FiX size={16} />
            </button>

            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
              <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#18181b] p-4">
                {previewEvent.image ? (
                  <img
                    src={previewEvent.image}
                    alt={previewEvent.name}
                    className="h-64 w-full object-contain"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center text-sm text-white/35">
                    No preview image
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                  Event Preview
                </p>
                <h3 className="mt-3 text-3xl font-Playfair font-semibold text-white">
                  {previewEvent.name}
                </h3>
                <p className="mt-3 text-sm text-white/50">{previewEvent.category}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Price</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatSellerCurrency(previewEvent.price)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                      Stock
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {previewEvent.stock}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                      Status
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {previewEvent.status}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                      Event ID
                    </p>
                    <p className="mt-2 break-all font-mono text-xs text-white/70">
                      {previewEvent._id || previewEvent.id}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                      Start Date
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatDate(previewEvent.startDate)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                      End Date
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatDate(previewEvent.endDate)}
                    </p>
                  </div>
                </div>

                {previewEvent.description ? (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                      Description
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">
                      {previewEvent.description}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SellerDashboardEventsPanel;
