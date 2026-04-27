import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const statusClasses = {
  Live: "border border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Scheduled: "border border-sky-300/30 bg-sky-300/10 text-sky-200",
  Draft: "border border-white/15 bg-white/5 text-white/70",
};

const SellerProfileEventsTab = ({ runningEvents }) => {
  if (!runningEvents.length) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Running Events</p>
        <h3 className="mt-3 text-2xl font-Playfair font-semibold text-white">
          No events yet
        </h3>
        <p className="mt-3 text-sm text-white/50">
          Create your first event to see it appear here with a live status and schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {runningEvents.map((event) => (
        <Link
          to={`/product/${event.id}`}
          key={event.id}
          className="group rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.4)] transition hover:border-emerald-300/30"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
              Running Event
            </p>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                statusClasses[event.status] || statusClasses.Draft
              }`}
            >
              {event.status}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-Playfair font-semibold text-white transition group-hover:text-emerald-200">
            {event.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/55">{event.detail}</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">Window</p>
            <p className="mt-2 text-sm text-white/75">{event.window}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/35">Impact</p>
            <p className="mt-2 text-sm text-emerald-300">{event.impact}</p>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
            View full details <FiArrowRight size={14} />
          </p>
        </Link>
      ))}
    </div>
  );
};

export default SellerProfileEventsTab;
