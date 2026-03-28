import { backend_url } from "../server";

export const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const toAbsoluteAssetUrl = (asset) => {
  if (!asset) {
    return "";
  }

  if (
    asset.startsWith("http://") ||
    asset.startsWith("https://") ||
    asset.startsWith("data:")
  ) {
    return asset;
  }

  return `${backend_url}${asset.replace(/^\/+/, "")}`;
};

const buildSvgPlaceholder = ({
  label = "S",
  background = "#18181b",
  accent = "#34d399",
  textColor = "#f8fafc",
}) => {
  const safeLabel = String(label || "S")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 2)
    .toUpperCase() || "S";

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="${safeLabel}">
      <rect width="200" height="200" rx="36" fill="${background}" />
      <circle cx="100" cy="100" r="72" fill="${accent}" opacity="0.18" />
      <text x="100" y="114" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="${textColor}">${safeLabel}</text>
    </svg>`
  )}`;
};

const buildBannerPlaceholder = (name = "Shop") => {
  const safeLabel = String(name || "Shop")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 2)
    .toUpperCase() || "S";

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" role="img" aria-label="Shop banner">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f0f12" />
          <stop offset="55%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#111114" />
        </linearGradient>
        <linearGradient id="wave" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#34d399" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#bg)" />
      <circle cx="210" cy="80" r="190" fill="#34d399" opacity="0.10" />
      <circle cx="1040" cy="330" r="220" fill="#ffffff" opacity="0.05" />
      <path d="M0 275C145 235 250 215 392 230C536 246 628 320 777 320C920 320 1036 255 1200 220V400H0Z" fill="url(#wave)" />
      <rect x="92" y="92" width="160" height="160" rx="42" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.10" />
      <text x="172" y="188" text-anchor="middle" font-family="Arial, sans-serif" font-size="62" font-weight="700" fill="#f8fafc">${safeLabel}</text>
      <rect x="92" y="296" width="228" height="40" rx="20" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.08" />
      <text x="120" y="321" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="#f8fafc" fill-opacity="0.78">Seller storefront</text>
    </svg>`
  )}`;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toTagArray = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const toShortDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const getEventStatus = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Draft";
  }

  const now = Date.now();

  if (now < start.getTime()) {
    return "Scheduled";
  }

  if (now > end.getTime()) {
    return "Ended";
  }

  return "Live";
};

export const normalizeSeller = (seller = {}, productCountOverride = null) => {
  const id = seller?._id || seller?.id || "";
  const name = seller?.shopName || seller?.name || "Untitled Shop";
  const avatar =
    toAbsoluteAssetUrl(seller?.avatar || "") || buildSvgPlaceholder({ label: name[0] || "S" });
  const banner = toAbsoluteAssetUrl(seller?.banner || "") || buildBannerPlaceholder(name);
  const productCount =
    productCountOverride !== null
      ? productCountOverride
      : toNumber(seller?.productCount ?? seller?.products, 0);

  return {
    id,
    _id: id,
    name,
    shopName: name,
    handle: seller?.handle || slugify(name) || `shop-${String(id).slice(-6)}`,
    avatar,
    banner,
    description: seller?.description || "No shop description added yet.",
    rating: toNumber(seller?.rating, 0),
    followers: toNumber(seller?.followers, 0),
    phone: seller?.phone || "",
    address: seller?.address || "",
    zip: seller?.zip || "",
    email: seller?.email || "",
    products: productCount,
    productCount,
    createdAt: seller?.createdAt || "",
  };
};

export const normalizeProduct = (product = {}) => {
  const shop = product?.shop ? normalizeSeller(product.shop) : null;
  const gallery = Array.isArray(product?.images)
    ? product.images.map((image) => toAbsoluteAssetUrl(image))
    : Array.isArray(product?.gallery)
      ? product.gallery.map((image) => toAbsoluteAssetUrl(image))
      : [];
  const image =
    gallery[0] || toAbsoluteAssetUrl(product?.image || product?.images?.[0] || "");
  const sold = toNumber(product?.sold_out ?? product?.sold, 0);
  const price = toNumber(product?.discountPrice ?? product?.price, 0);
  const originalPriceValue = product?.orignalPrice ?? product?.originalPrice;
  const originalPrice =
    originalPriceValue === null || originalPriceValue === undefined || originalPriceValue === ""
      ? null
      : toNumber(originalPriceValue, 0);
  const createdAt = product?.createdAt || "";
  const createdAtTime = createdAt ? new Date(createdAt).getTime() : 0;
  const isNew = createdAtTime
    ? Date.now() - createdAtTime <= 1000 * 60 * 60 * 24 * 14
    : Boolean(product?.isNew);
  const shopName = shop?.name || product?.shopName || "Unknown shop";
  const shopId = product?.shopId || shop?.id || "";

  return {
    id: product?._id || product?.id || "",
    _id: product?._id || product?.id || "",
    name: product?.name || "Untitled product",
    description: product?.description || "",
    category: product?.category || "Uncategorized",
    tags: toTagArray(product?.tags),
    couponCode: product?.couponCode || "",
    price,
    originalPrice,
    rating: toNumber(product?.rating, shop?.rating || 0),
    reviews: toNumber(product?.reviews, 0),
    image,
    gallery: gallery.length ? gallery : image ? [image] : [],
    shopId,
    shopName,
    shopHandle: shop?.handle || product?.shopHandle || slugify(shopName),
    shopAvatar: shop?.avatar || toAbsoluteAssetUrl(product?.shopAvatar || ""),
    shopDescription: shop?.description || product?.shopDescription || "",
    shopFollowers: toNumber(product?.shopFollowers, shop?.followers || 0),
    shopRating: toNumber(product?.shopRating, shop?.rating || 0),
    sold,
    stock: toNumber(product?.stock, 0),
    inStock: toNumber(product?.stock, 0) > 0,
    isBestSeller: product?.isBestSeller ?? sold >= 10,
    isNew,
    createdAt,
  };
};

export const normalizeEvent = (event = {}) => {
  const shop = event?.shop ? normalizeSeller(event.shop) : null;
  const gallery = Array.isArray(event?.images)
    ? event.images.map((image) => toAbsoluteAssetUrl(image))
    : Array.isArray(event?.gallery)
      ? event.gallery.map((image) => toAbsoluteAssetUrl(image))
      : [];
  const image =
    gallery[0] || toAbsoluteAssetUrl(event?.image || event?.images?.[0] || "");
  const shopName = shop?.name || event?.shopName || "Unknown shop";
  const startDate = event?.startDate || event?.start_Date || "";
  const endDate = event?.endDate || event?.Finish_Date || "";
  const status = event?.status || getEventStatus(startDate, endDate);

  return {
    id: event?._id || event?.id || "",
    _id: event?._id || event?.id || "",
    name: event?.name || event?.title || "Untitled event",
    title: event?.name || event?.title || "Untitled event",
    description: event?.description || event?.detail || "",
    detail: event?.description || event?.detail || "",
    category: event?.category || "Uncategorized",
    tags: toTagArray(event?.tags),
    couponCode: event?.couponCode || "",
    price: toNumber(event?.discountPrice ?? event?.price, 0),
    originalPrice:
      event?.orignalPrice === null || event?.orignalPrice === undefined || event?.orignalPrice === ""
        ? null
        : toNumber(event?.orignalPrice, 0),
    stock: toNumber(event?.stock, 0),
    image,
    gallery: gallery.length ? gallery : image ? [image] : [],
    shopId: event?.shopId || shop?.id || "",
    shopName,
    shopHandle: shop?.handle || event?.shopHandle || slugify(shopName),
    startDate,
    endDate,
    status,
    window:
      startDate && endDate
        ? `${toShortDate(startDate)} - ${toShortDate(endDate)}`
        : "Schedule pending",
    impact: `${toNumber(event?.stock, 0)} promotional units`,
    createdAt: event?.createdAt || "",
  };
};

export const deriveCategories = (products = []) => {
  const counts = new Map();

  products.forEach((product) => {
    const categoryName = product?.category?.trim();
    if (!categoryName) {
      return;
    }

    counts.set(categoryName, (counts.get(categoryName) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([name, count], index) => ({
      id: index + 1,
      name,
      count,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.name.localeCompare(b.name);
    });
};
