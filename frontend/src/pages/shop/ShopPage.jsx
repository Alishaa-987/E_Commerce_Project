import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import CountdownTimer from "../../components/common/CountdownTimer";
import ProductCard from "../../components/cards/ProductCard";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import { getShopByHandle } from "../../redux/actions/seller";

const pageCopy = {
  products: {
    eyebrow: "Shop Products",
    title: (shopName) => `Everything available from ${shopName}`,
    body:
      "Browse the full shop catalog in a cleaner storefront view with the shop profile staying anchored above the content.",
  },
  events: {
    eyebrow: "Running Events",
    title: () => "Campaigns and live offers",
    body:
      "This page focuses only on active and upcoming shop events, so drops and campaigns are easier to scan on their own.",
  },
  reviews: {
    eyebrow: "Shop Reviews",
    title: () => "Storefront review signals",
    body:
      "Written shop reviews are not connected yet, so this page summarizes real product ratings and review counts from the visible catalog.",
  },
};

const statusClasses = {
  Live: "border border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Scheduled: "border border-sky-300/30 bg-sky-300/10 text-sky-200",
  Draft: "border border-white/15 bg-white/5 text-white/70",
  Ended: "border border-white/10 bg-white/[0.04] text-white/45",
};

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) {
    return "Schedule pending";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Schedule pending";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatReviewCount = (value) => {
  const count = Number(value || 0);
  return `${count.toLocaleString()} ${count === 1 ? "review" : "reviews"}`;
};

const MetricCard = ({ label, value, detail, icon: Icon }) => (
  <div className="rounded-[26px] border border-white/10 bg-[#111114] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.34)]">
    <div className="flex items-center gap-2 text-white/35">
      {Icon ? <Icon size={14} className="text-emerald-300" /> : null}
      <p className="text-[10px] uppercase tracking-[0.24em]">{label}</p>
    </div>
    <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
    <p className="mt-2 text-sm leading-6 text-white/45">{detail}</p>
  </div>
);

const EmptyState = ({ title, body }) => (
  <div className="rounded-[30px] border border-white/10 bg-[#111114] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
    <h3 className="text-2xl font-Playfair font-semibold text-white">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-white/50">{body}</p>
  </div>
);

const ShopPage = ({ section = "products" }) => {
  const { handle } = useParams();
  const [followed, setFollowed] = useState(false);
  const dispatch = useDispatch();
  const { allShops, publicShop, publicShopLoading } = useSelector((state) => state.seller);
  const { allProducts, allProductsLoading } = useSelector((state) => state.products);
  const { allEvents, allEventsLoading } = useSelector((state) => state.events);

  const activeSection = pageCopy[section] ? section : "products";

  const shop = useMemo(
    () =>
      (publicShop?.handle === handle && publicShop) ||
      allShops.find((seller) => seller.handle === handle),
    [allShops, handle, publicShop]
  );

  useEffect(() => {
    if (handle && !shop) {
      dispatch(getShopByHandle(handle));
    }
  }, [dispatch, handle, shop]);

  const shopProducts = useMemo(
    () => (shop ? allProducts.filter((product) => product.shopId === shop.id) : []),
    [allProducts, shop]
  );

  const runningEvents = useMemo(() => {
    if (!shop) {
      return [];
    }

    return allEvents
      .filter(
        (event) =>
          event.shopId === shop.id &&
          (event.status === "Live" || event.status === "Scheduled")
      )
      .sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "Live" ? -1 : 1;
        }

        const aTime = new Date(a.startDate || a.endDate || 0).getTime();
        const bTime = new Date(b.startDate || b.endDate || 0).getTime();
        return aTime - bTime;
      });
  }, [allEvents, shop]);

  const reviewProducts = useMemo(
    () =>
      [...shopProducts]
        .filter(
          (product) => Number(product.reviews || 0) > 0 || Number(product.rating || 0) > 0
        )
        .sort((a, b) => {
          if (Number(b.reviews || 0) !== Number(a.reviews || 0)) {
            return Number(b.reviews || 0) - Number(a.reviews || 0);
          }

          return Number(b.rating || 0) - Number(a.rating || 0);
        }),
    [shopProducts]
  );

  const totalSold = useMemo(
    () => shopProducts.reduce((sum, product) => sum + Number(product.sold || 0), 0),
    [shopProducts]
  );
  const totalReviews = useMemo(
    () => reviewProducts.reduce((sum, product) => sum + Number(product.reviews || 0), 0),
    [reviewProducts]
  );
  const averageRating = useMemo(() => {
    if (totalReviews > 0) {
      const weightedRating = reviewProducts.reduce(
        (sum, product) => sum + Number(product.rating || 0) * Number(product.reviews || 0),
        0
      );
      return (weightedRating / totalReviews).toFixed(1);
    }

    return Number(shop?.rating || 0).toFixed(1);
  }, [reviewProducts, shop, totalReviews]);

  const spotlightEvent = runningEvents[0] || null;
  const extraEvents = runningEvents.slice(1);
  const topReviewedProduct = reviewProducts[0] || null;
  const countdownTarget = spotlightEvent
    ? new Date(
        spotlightEvent.status === "Scheduled"
          ? spotlightEvent.startDate
          : spotlightEvent.endDate
      ).getTime()
    : 0;
  const showCountdown = Number.isFinite(countdownTarget) && countdownTarget > Date.now();

  const navItems = useMemo(
    () => [
      { key: "products", label: "Shop Products", to: `/shop/${handle}` },
      { key: "events", label: "Running Events", to: `/shop/${handle}/events` },
      { key: "reviews", label: "Shop Reviews", to: `/shop/${handle}/reviews` },
    ],
    [handle]
  );

  const heroMetrics = [
    {
      icon: AiFillStar,
      label: `${averageRating} rating`,
    },
    {
      icon: FiPackage,
      label: `${shopProducts.length} products`,
    },
    {
      icon: FiClock,
      label: `${runningEvents.length} events`,
    },
    {
      icon: FiUsers,
      label: `${Number(shop?.followers || 0).toLocaleString()} followers`,
    },
  ];

  const heroMeta = [
    shop?.address ? { id: "address", icon: FiMapPin, value: shop.address } : null,
    shop?.phone ? { id: "phone", icon: FiPhone, value: shop.phone } : null,
    shop?.email ? { id: "email", icon: FiMail, value: shop.email } : null,
    {
      id: "joined",
      icon: FiCalendar,
      value: `Joined ${formatDate(shop?.createdAt)}`,
    },
  ].filter(Boolean);

  const productStats = [
    {
      label: "Catalog Size",
      value: shopProducts.length,
      detail: "Products currently listed",
      icon: FiPackage,
    },
    {
      label: "Units Sold",
      value: totalSold.toLocaleString(),
      detail: "Combined sales across visible products",
      icon: FiTrendingUp,
    },
    {
      label: "Review Signals",
      value: totalReviews.toLocaleString(),
      detail: "Catalog feedback connected to this shop",
      icon: AiFillStar,
    },
  ];

  const reviewStats = [
    {
      label: "Average Rating",
      value: averageRating,
      detail: "Across visible product review data",
      icon: AiFillStar,
    },
    {
      label: "Total Reviews",
      value: totalReviews.toLocaleString(),
      detail: "Count pulled from the product catalog",
      icon: FiUsers,
    },
    {
      label: "Top Feedback Item",
      value: topReviewedProduct?.name || "Waiting",
      detail: topReviewedProduct
        ? formatReviewCount(topReviewedProduct.reviews)
        : "This area updates when reviews exist.",
      icon: FiTrendingUp,
    },
  ];

  if ((publicShopLoading && !shop) || allProductsLoading || allEventsLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins flex items-center justify-center">
        <p className="text-white/40 text-xl font-Playfair">Loading shop...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-white/40 text-xl font-Playfair">Shop not found</p>
          <Link to="/" className="text-emerald-300 text-sm hover:text-white transition">
            &larr; Go home
          </Link>
        </div>
      </div>
    );
  }

  const renderProductsPage = () => (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {productStats.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      {shopProducts.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shopProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products yet"
          body="This shop has not published any products yet."
        />
      )}
    </div>
  );

  const renderEventsPage = () =>
    spotlightEvent ? (
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="rounded-[32px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                {spotlightEvent.status === "Scheduled" ? "Starts soon" : "Live now"}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  statusClasses[spotlightEvent.status] || statusClasses.Draft
                }`}
              >
                {spotlightEvent.status}
              </span>
            </div>

            <h3 className="mt-5 text-3xl font-Playfair font-semibold text-white">
              {spotlightEvent.name}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/55">
              {spotlightEvent.description ||
                "This seller event does not have a public summary yet, but its schedule and offer details are visible here."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">Offer Price</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {formatMoney(spotlightEvent.price)}
                </p>
                {spotlightEvent.originalPrice ? (
                  <p className="mt-2 text-sm text-white/35 line-through">
                    {formatMoney(spotlightEvent.originalPrice)}
                  </p>
                ) : null}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">Window</p>
                <p className="mt-3 text-sm leading-7 text-white/75">{spotlightEvent.window}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/product/${spotlightEvent.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0b0d] transition hover:-translate-y-0.5"
              >
                View event details
                <FiArrowRight size={13} />
              </Link>
              <Link
                to={
                  spotlightEvent.category
                    ? `/products?category=${encodeURIComponent(spotlightEvent.category)}`
                    : "/products"
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white/25 hover:text-white"
              >
                Browse related products
                <FiArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <Link
              to={`/product/${spotlightEvent.id}`}
              className="group block overflow-hidden rounded-[30px] border border-white/10 bg-[#111114] shadow-[0_24px_70px_rgba(0,0,0,0.35)] transition hover:border-emerald-300/30"
            >
              {spotlightEvent.image ? (
                <img
                  src={spotlightEvent.image}
                  alt={spotlightEvent.name}
                  className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="aspect-[4/3] w-full bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.18),transparent_55%),#111114]" />
              )}
            </Link>

            <div className="rounded-[30px] border border-white/10 bg-[#111114] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                Event Countdown
              </p>
              {showCountdown ? (
                <div className="mt-5">
                  <CountdownTimer endDate={countdownTarget} />
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-white/55">{spotlightEvent.window}</p>
              )}
            </div>
          </div>
        </div>

        {extraEvents.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {extraEvents.map((event) => (
              <Link
                to={`/product/${event.id}`}
                key={event.id}
                className="group rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.38)] transition hover:border-emerald-300/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                    Seller Event
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
                  {event.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  {event.description || "This campaign does not have a public description yet."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/55">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                    {event.window}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                    {event.category}
                  </span>
                </div>
                <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  View full details <FiArrowRight size={14} />
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    ) : (
      <EmptyState
        title="No running events yet"
        body="This shop has not launched a live or upcoming campaign yet."
      />
    );

  const renderReviewsPage = () => (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {reviewStats.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      {reviewProducts.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {reviewProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d] p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                    {product.category}
                  </p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="mt-2 text-xl font-Playfair font-semibold text-white transition hover:text-emerald-200">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mt-2 text-sm text-white/40">{product.shopName}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/55">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-white/80">
                  Rating {product.rating}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                  {formatReviewCount(product.reviews)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                  {Number(product.sold || 0).toLocaleString()} sold
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                  {formatMoney(product.price)}
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                  Review Summary
                </p>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  This product is one of the strongest visible review signals for the shop.
                  When written review content exists in the backend, those real comments can
                  replace this summary card.
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No public reviews yet"
          body="This shop does not have visible product review data yet, but this page is ready to populate automatically when that data appears."
        />
      )}
    </div>
  );

  const pageContent =
    activeSection === "events"
      ? renderEventsPage()
      : activeSection === "reviews"
      ? renderReviewsPage()
      : renderProductsPage();

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-4rem] top-0 h-72 w-72 rounded-full bg-emerald-300/10 blur-[170px]" />
        <div className="absolute left-[-5rem] bottom-0 h-72 w-72 rounded-full bg-white/5 blur-[160px]" />
      </div>
      <Navbar />

      <section className="relative pt-24 pb-16">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="rounded-[32px] border border-white/10 bg-[#111114] px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <img
                  src={shop.avatar}
                  alt={shop.name}
                  className="h-24 w-24 rounded-[28px] border border-white/10 object-cover shadow-[0_16px_40px_rgba(0,0,0,0.38)]"
                />
                <div className="max-w-3xl">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-emerald-200/70">
                    Seller storefront
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-Playfair font-semibold text-white sm:text-4xl">
                      {shop.name}
                    </h1>
                    {shop.handle ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
                        @{shop.handle}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base">
                    {shop.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setFollowed((value) => !value)}
                className={`self-start rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition lg:self-auto ${
                  followed
                    ? "border border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                    : "bg-white text-[#0b0b0d] hover:-translate-y-0.5"
                }`}
              >
                {followed ? "Following" : "Follow Shop"}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {heroMetrics.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/70"
                  >
                    <Icon size={14} className="text-emerald-300" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {heroMeta.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0b0b0d] px-4 py-2.5 text-sm text-white/60"
                  >
                    <Icon size={14} className="text-emerald-300" />
                    <span>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-[#111114] p-2 shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col gap-2 md:flex-row">
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end={item.key === "products"}
                  className={({ isActive }) =>
                    `flex flex-1 items-center justify-center gap-2 rounded-[20px] px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-[#0b0b0d]"
                        : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                    }`
                  }
                >
                  <span>{item.label}</span>
                  <FiArrowRight size={13} />
                </NavLink>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[30px] border border-white/10 bg-[#111114] px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">
              {pageCopy[activeSection].eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-Playfair font-semibold text-white">
              {pageCopy[activeSection].title(shop.name)}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/50">
              {pageCopy[activeSection].body}
            </p>
          </div>

          <div className="mt-6">{pageContent}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShopPage;
