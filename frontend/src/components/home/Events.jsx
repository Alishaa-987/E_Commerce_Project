import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { useSelector } from "react-redux";
import CountdownTimer from "../common/CountdownTimer";

const statusPriority = {
  Live: 0,
  Scheduled: 1,
  Draft: 2,
  Ended: 3,
};

const formatMoney = (value) => Number(value || 0).toFixed(2);

const Events = () => {
  const { allEvents, allEventsLoading } = useSelector((state) => state.events);
  const featuredEvent = useMemo(
    () =>
      [...allEvents].sort((a, b) => {
        const statusDiff =
          (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99);
        if (statusDiff !== 0) {
          return statusDiff;
        }

        const aTime = new Date(a.endDate || a.startDate || 0).getTime();
        const bTime = new Date(b.endDate || b.startDate || 0).getTime();
        return aTime - bTime;
      })[0],
    [allEvents]
  );

  if (allEventsLoading) {
    return (
      <section className="bg-[#0b0b0d] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-[#111114] px-8 py-20 text-center text-base text-white/45">
            Loading marketplace events...
          </div>
        </div>
      </section>
    );
  }

  if (!featuredEvent) {
    return (
      <section className="bg-[#0b0b0d] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-[#111114] px-8 py-20 text-center">
            <p className="text-xl font-semibold text-white">No live events yet</p>
            <p className="mt-3 text-base text-white/45">
              Seller campaigns from the backend will appear here once an event is created.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-base font-medium text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Browse products <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const discount = featuredEvent.originalPrice
    ? Math.max(
        0,
        Math.round(
          ((featuredEvent.originalPrice - featuredEvent.price) /
            featuredEvent.originalPrice) *
            100
        )
      )
    : 0;
  const countdownTarget = new Date(
    featuredEvent.status === "Scheduled"
      ? featuredEvent.startDate
      : featuredEvent.endDate
  ).getTime();
  const showCountdown = Number.isFinite(countdownTarget) && countdownTarget > Date.now();
  const primaryLink = featuredEvent.shopHandle
    ? `/shop/${featuredEvent.shopHandle}`
    : "/products";
  const browseLink = featuredEvent.category
    ? `/products?category=${encodeURIComponent(featuredEvent.category)}`
    : "/products";
  const countdownLabel =
    featuredEvent.status === "Scheduled" ? "Starts in" : "Sale ends in";
  const eventMetaLabel = featuredEvent.status === "Scheduled" ? "Starts soon" : "Live now";
  const headline =
    discount > 0
      ? `Up to ${discount}% off on limited event picks`
      : "Fresh promotional events from live sellers";

  return (
    <section className="bg-[#0b0b0d] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-[#111114]">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-300/5 blur-[100px]" />

          <div className="relative grid gap-10 p-10 sm:p-14 lg:grid-cols-2 lg:items-center">
            <div className="space-y-7">
              <div className="flex items-center gap-3.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                <span className="text-xs uppercase tracking-widest text-emerald-300">
                  Seller event | {eventMetaLabel}
                </span>
              </div>

              <div>
                <h2 className="text-4xl font-Playfair font-semibold leading-tight text-white sm:text-5xl">
                  {headline}
                </h2>
                <p className="mt-4 text-base text-white/50">
                  {featuredEvent.description ||
                    "Visit the seller storefront to see the campaign details and current offer window."}
                </p>
              </div>

              {showCountdown ? (
                <div>
                  <p className="mb-4 text-xs uppercase tracking-widest text-white/30">
                    {countdownLabel}
                  </p>
                  <CountdownTimer endDate={countdownTarget} />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#0b0b0d] px-5 py-4 text-base text-white/55">
                  {featuredEvent.window}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Link
                  to={primaryLink}
                  className="flex items-center gap-2.5 rounded-xl bg-emerald-300 px-7 py-3.5 text-base font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
                >
                  Visit shop <FiArrowRight size={16} />
                </Link>
                <Link
                  to={browseLink}
                  className="flex items-center gap-2.5 rounded-xl border border-white/15 px-7 py-3.5 text-base font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
                >
                  Browse related products <FiArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-5 rounded-3xl border border-emerald-300/10 bg-emerald-300/5" />
                <div className="relative w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d] sm:w-80">
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.name}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="absolute right-4 top-4 rounded-xl bg-emerald-300 px-4 py-2 text-center">
                    <p className="text-xs font-bold uppercase text-[#0b0b0d]">
                      {discount > 0 ? `-${discount}%` : featuredEvent.status}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-[#111114] p-5">
                  <p className="mb-1.5 text-sm text-white/40">{featuredEvent.shopName}</p>
                  <p className="mb-3 text-lg font-semibold text-white">{featuredEvent.name}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white">
                        ${formatMoney(featuredEvent.price)}
                      </span>
                      {featuredEvent.originalPrice ? (
                        <span className="text-base text-white/30 line-through">
                          ${formatMoney(featuredEvent.originalPrice)}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-white/50">
                      <AiFillStar size={14} className="text-emerald-300" />
                      {featuredEvent.status} | {featuredEvent.stock} units
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-white/35">{featuredEvent.window}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
