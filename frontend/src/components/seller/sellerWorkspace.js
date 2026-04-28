import {
  FiClock,
  FiDollarSign,
  FiGrid,
  FiMail,
  FiPackage,
  FiPlusSquare,
  FiRefreshCw,
  FiSettings,
  FiTag,
  FiBox,
} from "react-icons/fi";
import { formatSellerCurrency } from "./sellerSession";

export const sellerNavItems = [
  { key: "dashboard", label: "Dashboard", icon: FiGrid, path: "/seller/dashboard" },
  { key: "allOrders", label: "All Orders", icon: FiPackage, path: "/seller/orders" },
  { key: "allProducts", label: "All Products", icon: FiBox, path: "/seller/products" },
  {
    key: "createProduct",
    label: "Create Product",
    icon: FiPlusSquare,
    path: "/seller/create-product",
  },
  { key: "allEvents", label: "All Events", icon: FiClock, path: "/seller/events" },
  {
    key: "createEvent",
    label: "Create Event",
    icon: FiPlusSquare,
    path: "/seller/create-event",
  },
  {
    key: "withdrawMoney",
    label: "Withdraw Money",
    icon: FiDollarSign,
    path: "/seller/withdraw-money",
  },
  { key: "shopInbox", label: "Shop Inbox", icon: FiMail, path: "/seller/inbox" },
  {
    key: "discountCodes",
    label: "Discount Codes",
    icon: FiTag,
    path: "/seller/discount-codes",
  },
  { key: "refunds", label: "Refunds", icon: FiRefreshCw, path: "/seller/refunds" },
  { key: "settings", label: "Settings", icon: FiSettings, path: "/seller/profile" },
];

export const getSellerNavPath = (key) =>
  sellerNavItems.find((item) => item.key === key)?.path || "/seller/dashboard";

export const getSellerNavItem = (key) =>
  sellerNavItems.find((item) => item.key === key);

export const getSellerActiveNavKey = (pathname) =>
  sellerNavItems.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`)
  )?.key || "dashboard";

export const sellerProfileTabs = [
  { key: "products", label: "Shop Products" },
  { key: "events", label: "Running Events" },
  { key: "reviews", label: "Shop Reviews" },
];

export const sellerDashboardWorkspaceCopy = {
  allEvents:
    "Review live and upcoming campaigns tied to your shop so you can track what is currently running.",
  withdrawMoney:
    "Payout workflows are not connected yet. When the backend payout module is added, your live balance and withdrawal history will appear here.",
  discountCodes:
    "Discount code management is not connected yet. Add the backend discount flow here when you are ready to support real coupons.",
  refunds:
    "Refund operations are not connected yet. Once the refund API is added, requests and resolutions will show here instead of mock content.",
  settings:
    "Store settings are ready for real seller data, but profile editing has not been wired yet. This section can be connected to an update-seller endpoint next.",
};

const toReadableJoinedDate = (value) => {
  if (!value) {
    return "Recently joined";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently joined";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fallbackSeller = {
  id: "",
  _id: "",
  name: "Your Shop",
  shopName: "Your Shop",
  handle: "",
  avatar: "",
  banner: "",
  description: "Set up your storefront details to personalize this workspace.",
  rating: 0,
  followers: 0,
  phone: "",
  address: "",
  zip: "",
  email: "",
  productCount: 0,
  products: 0,
  createdAt: "",
};

export const getSellerAverageRating = (items = [], fallbackRating = 0) => {
  if (!items.length) {
    return Number(fallbackRating || 0).toFixed(1);
  }

  return (
    items.reduce((sum, item) => sum + Number(item.rating || 0), 0) / items.length
  ).toFixed(1);
};

export const getSellerWorkspaceData = ({
  sellerShop,
  sellerProducts = [],
  sellerEvents = [],
  storedEmail = "",
  sellerAvatar = "",
}) => {
  const shop = sellerShop || fallbackSeller;
  const resolvedAvatar = sellerAvatar || shop.avatar || "";

  const now = new Date();
  const processedEvents = (sellerEvents || []).map((event) => {
    const endDate = new Date(event.Finish_Date || event.endDate);
    const isExpired = endDate < now;
    return {
      ...event,
      id: event._id || event.id,
      status: isExpired ? "Expired" : "Running",
      window: isExpired 
        ? "Ended" 
        : `Ends ${new Date(endDate).toLocaleDateString()}`,
    };
  });

  // Sort events: Running first, then by end date
  processedEvents.sort((a, b) => {
    if (a.status === "Running" && b.status === "Expired") return -1;
    if (a.status === "Expired" && b.status === "Running") return 1;
    return new Date(b.Finish_Date || b.endDate) - new Date(a.Finish_Date || a.endDate);
  });

  return {
    storedEmail: storedEmail || shop.email || "",
    sellerShop: shop,
    sellerProducts,
    sellerProductCount: (sellerProducts || []).length,
    sellerAvatar: resolvedAvatar,
    shopMeta: {
      address: shop.address || "No address added yet.",
      phone: shop.phone || "No phone added yet.",
      joinedOn: toReadableJoinedDate(shop.createdAt),
    },
    runningEvents: processedEvents,
    shopReviews: [],
  };
};

export const getSellerDashboardData = ({
  sellerShop,
  sellerProducts = [],
  sellerEvents = [],
  sellerOrders = [],
  storedEmail = "",
  sellerAvatar = "",
}) => {
  const workspace = getSellerWorkspaceData({
    sellerShop,
    sellerProducts,
    sellerEvents,
    storedEmail,
    sellerAvatar,
  });
  const { sellerShop: shop, sellerProductCount } = workspace;
  const averageRating = getSellerAverageRating(workspace.sellerProducts, shop.rating);
  
  // Calculate revenue from orders, excluding refunded ones
  const totalRevenue = sellerOrders
    .filter(order => order.status !== "Refund Success" && order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

  const soldItemsCount = sellerOrders
    .filter(order => order.status !== "Cancelled")
    .reduce((sum, order) => sum + (order.cart?.length || 0), 0);

  const overviewCards = [
    {
      label: "Net Revenue",
      value: formatSellerCurrency(totalRevenue),
      detail: "Excluding refunds",
      metricKey: "revenue",
    },
    {
      label: "Items Sold",
      value: soldItemsCount.toLocaleString(),
      detail: "Total units",
      metricKey: "orders",
    },
    {
      label: "Store Followers",
      value: Number(shop.followers || 0).toLocaleString(),
      detail: "Shop audience",
      metricKey: "followers",
    },
    {
      label: "Average Rating",
      value: averageRating,
      detail: `${sellerProductCount} listings`,
      metricKey: "rating",
    },
  ];

  return {
    ...workspace,
    averageRating,
    totalRevenue,
    recentOrders: sellerOrders.slice(0, 5),
    inboxThreads: [],
    overviewCards,
  };
};
