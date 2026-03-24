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
import { shops } from "../../data/mockData";
import { getCatalogProductsByShopId } from "../../data/catalog";
import { backend_url } from "../../server";
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
  { key: "settings", label: "Settings", icon: FiSettings, path: "/seller/settings" },
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
  createProduct:
    "Start a new product draft, upload media, and prepare the next item for launch.",
  allEvents:
    "Review live and upcoming campaigns tied to your shop so you can track what is currently running.",
  createEvent:
    "Set up a new shop event with timing, offer details, and featured products before it goes live.",
  withdrawMoney:
    "Check your payout balance, upcoming releases, and the amount that can be withdrawn next.",
  discountCodes:
    "Create and manage discount codes for launches, repeat buyers, and limited campaigns.",
  refunds:
    "Handle refund requests, order issues, and buyer resolutions from one place.",
  settings:
    "Update store details, storefront defaults, and seller-side operational preferences.",
};

const sellerMetaByHandle = {
  "studio-blanc": {
    address: "4678 Honeysuckle Lane, Seattle",
    phone: "1783811512",
    joinedOn: "2023-03-17",
  },
  "maison-luxe": {
    address: "915 Riverview Avenue, New York",
    phone: "2125550193",
    joinedOn: "2022-11-08",
  },
  "lumiere-beauty": {
    address: "74 Rosewater Street, Los Angeles",
    phone: "3105551227",
    joinedOn: "2023-05-21",
  },
  "tech-vault": {
    address: "1208 Harbor Tech Drive, San Jose",
    phone: "4085554300",
    joinedOn: "2021-09-14",
  },
  "street-form": {
    address: "85 Mercer Lane, Chicago",
    phone: "7735554401",
    joinedOn: "2024-01-05",
  },
  timecraft: {
    address: "18 Regent Square, Boston",
    phone: "6175557722",
    joinedOn: "2022-02-18",
  },
};

export const getSellerWorkspaceData = (productLimit = 8) => {
  const storage =
    typeof window !== "undefined" ? window.localStorage : null;
  const storedShopName = storage?.getItem("sellerShopName");
  const storedEmail = storage?.getItem("sellerEmail") || "seller@lumen.market";
  const storedAvatar = storage?.getItem("sellerAvatar");

  const sellerShop =
    shops.find((shop) => shop.name === storedShopName) ||
    shops.find((shop) => shop.name === "Studio Blanc") ||
    shops[0];

  const allSellerProducts = getCatalogProductsByShopId(sellerShop.id);
  const sellerProducts = allSellerProducts.slice(0, productLimit);
  const sellerProductCount = allSellerProducts.length;

  const sellerAvatar =
    storedAvatar && !storedAvatar.startsWith("http")
      ? `${backend_url}${storedAvatar}`
      : storedAvatar || sellerShop.avatar;

  const shopMeta = sellerMetaByHandle[sellerShop.handle] || {
    address: "204 Market Street, Seattle",
    phone: "2065552030",
    joinedOn: "2023-01-12",
  };

  const runningEvents = [
    {
      id: "event-1",
      title: `${sellerShop.name} Weekend Edit`,
      window: "Mar 23 - Mar 27",
      status: "Live",
      detail: "Bundle the best-selling picks into a limited home refresh drop.",
      impact: "2.3k impressions",
    },
    {
      id: "event-2",
      title: "VIP Repeat Buyers",
      window: "Mar 28 - Apr 01",
      status: "Scheduled",
      detail: "Private access for returning customers before the public release.",
      impact: "148 notified shoppers",
    },
    {
      id: "event-3",
      title: "Free Shipping Threshold Push",
      window: "Apr 04 - Apr 07",
      status: "Draft",
      detail: "Lift average order value with a higher free-shipping threshold campaign.",
      impact: "Projected +9% basket size",
    },
  ];

  const shopReviews = [
    {
      id: "review-1",
      name: "Areeba Hassan",
      rating: 5,
      date: "2 days ago",
      title: "Packaging felt premium",
      body: "Everything arrived carefully packed and exactly matched the shop photos.",
    },
    {
      id: "review-2",
      name: "Marcus Lee",
      rating: 4,
      date: "5 days ago",
      title: "Fast dispatch",
      body: "The seller answered quickly and shipped faster than expected.",
    },
    {
      id: "review-3",
      name: "Sofia Bennett",
      rating: 5,
      date: "1 week ago",
      title: "Will order again",
      body: "Quality was strong and the storefront experience felt polished from start to finish.",
    },
  ];

  return {
    storedEmail,
    sellerShop,
    sellerProducts,
    sellerProductCount,
    sellerAvatar,
    shopMeta,
    runningEvents,
    shopReviews,
  };
};

export const getSellerAverageRating = (items, fallbackRating) => {
  if (!items.length) {
    return fallbackRating.toFixed(1);
  }

  return (
    items.reduce((sum, item) => sum + item.rating, 0) / items.length
  ).toFixed(1);
};

export const getSellerDashboardData = (productLimit = 6) => {
  const workspace = getSellerWorkspaceData(productLimit);
  const { sellerShop, sellerProducts, sellerProductCount } = workspace;
  const averageRating = getSellerAverageRating(sellerProducts, sellerShop.rating);
  const totalRevenue = sellerProducts.reduce(
    (sum, product) => sum + product.sold * product.price,
    0
  );

  const recentOrders = sellerProducts.slice(0, 4).map((product, index) => ({
    id: `LM-${2401 + index}`,
    customer: ["Aisha Khan", "Noah Carter", "Sana Ali", "Omar Sheikh"][index],
    item: product.name,
    total: product.price * (index === 0 ? 2 : 1),
    status: ["Processing", "Packed", "Shipped", "Delivered"][index],
    placedAt: ["10 min ago", "42 min ago", "2 hrs ago", "Today, 9:14 AM"][index],
  }));

  const inboxThreads = [
    {
      name: "Amna Sheikh",
      subject: `Question about ${sellerProducts[0]?.name || "your listing"}`,
      time: "8m ago",
    },
    {
      name: "Jake Wilson",
      subject: "Bulk order for curated gifting",
      time: "34m ago",
    },
    {
      name: "Support Team",
      subject: "Dispatch profile updated",
      time: "2h ago",
    },
  ];

  const overviewCards = [
    {
      label: "Net Revenue",
      value: formatSellerCurrency(totalRevenue),
      detail: "+12.4% vs last month",
      metricKey: "revenue",
    },
    {
      label: "Orders Fulfilled",
      value: sellerProducts.reduce((sum, product) => sum + product.sold, 0).toLocaleString(),
      detail: "96% on-time dispatch",
      metricKey: "orders",
    },
    {
      label: "Store Followers",
      value: sellerShop.followers.toLocaleString(),
      detail: "Traffic rising this week",
      metricKey: "followers",
    },
    {
      label: "Average Rating",
      value: averageRating,
      detail: `${sellerProductCount} active listings`,
      metricKey: "rating",
    },
  ];

  return {
    ...workspace,
    averageRating,
    totalRevenue,
    recentOrders,
    inboxThreads,
    overviewCards,
  };
};
