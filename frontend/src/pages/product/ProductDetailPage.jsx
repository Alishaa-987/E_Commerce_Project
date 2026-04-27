import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { io } from "socket.io-client";
import {
  FiHeart,
  FiMessageSquare,
  FiPackage,
  FiShield,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/cards/ProductCard";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import ReviewForm from "../../components/product/ReviewForm";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getEventDetails } from "../../redux/actions/event";
import { getProductDetails } from "../../redux/actions/product";
import { resolveAvailableStock, slugify } from "../../utils/marketplace";

const Stars = ({ rating }) =>
  Array.from({ length: 5 }).map((_, index) =>
    index < Math.floor(rating) ? (
      <AiFillStar key={index} size={14} className="text-emerald-300" />
    ) : (
      <AiOutlineStar key={index} size={14} className="text-white/20" />
    )
  );

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { addToCart, getCartItemQty, isInCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [cartNotice, setCartNotice] = useState(null);
  const [fallbackEvent, setFallbackEvent] = useState(null);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { allProducts, productDetails, productDetailsLoading } = useSelector(
    (state) => state.products
  );
  const { allShops = [] } = useSelector((state) => state.seller);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { orders: userOrders } = useSelector((state) => state.order);

  const matchedProduct = useMemo(
    () =>
      allProducts.find((item) => item.id === id || item._id === id) ||
      (productDetails?.id === id || productDetails?._id === id
        ? productDetails
        : null),
    [allProducts, id, productDetails]
  );
  const product = matchedProduct || fallbackEvent;
  const isEventItem = !matchedProduct && Boolean(fallbackEvent);


  const productId = product?.id || product?._id || "";
  const socketRef = useRef(null);

  // Find the order containing this product (for verified purchase review)
  const productOrder = useMemo(() => {
    if (!isAuthenticated || !userOrders?.length || !productId) {
      return null;
    }
    return userOrders.find((order) =>
      order.cart?.some(
        (item) =>
          item.product?.toString() === productId.toString() ||
          item.id?.toString() === productId.toString() ||
          item._id?.toString() === productId.toString()
      )
    );
  }, [isAuthenticated, userOrders, productId]);

  useEffect(() => {
    setFallbackEvent(null);
    setFallbackLoading(false);
  }, [id]);

  // Real-time review updates via Socket.IO
  useEffect(() => {
    if (!productId) return;

    const socket = io("http://localhost:8000", {
      path: "/socket.io",
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ Review socket connected, ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("⚠️ Socket connection error:", err.message);
    });

    socket.on("newReview", (data) => {
      console.log("📨 New review received for product:", data.productId);
      if (data.productId === productId) {
        console.log("🔄 Refreshing product data...");
        dispatch(getProductDetails(productId));
      }
    });

    socket.on("productUpdated", (data) => {
      console.log("📨 Product update received:", data);
      if (data.productId === productId) {
        console.log("🔄 Refreshing product data...");
        dispatch(getProductDetails(productId));
      }
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Review socket disconnected");
    });

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, [productId, dispatch]);

  useEffect(() => {
    let isMounted = true;

    if (!id || matchedProduct) {
      return undefined;
    }

    const loadDetails = async () => {
      setFallbackLoading(true);
      setFallbackEvent(null);

      const productResult = await dispatch(getProductDetails(id));

      if (!isMounted) {
        return;
      }

      if (productResult?.success) {
        setFallbackLoading(false);
        return;
      }

      const eventResult = await dispatch(getEventDetails(id));

      if (!isMounted) {
        return;
      }

      if (eventResult?.success) {
        setFallbackEvent(eventResult.event);
      }

      setFallbackLoading(false);
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [dispatch, id, matchedProduct]);

  const stock = resolveAvailableStock(product);
  const soldOut = stock <= 0;
  const tags = product?.tags || [];
  const gallery = useMemo(() => {
    if (!product) {
      return [];
    }

    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
      return product.gallery;
    }

    return product.image ? [product.image] : [];
  }, [product]);
  const liked = isWishlisted(product);
  const inCart = isInCart(product);
  const cartQty = getCartItemQty(product);
  const remainingToAdd = Math.max(stock - cartQty, 0);
  const canAddMore = !soldOut && remainingToAdd > 0;
  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  const shop = product
    ? allShops.find(
        (seller) =>
          seller.id === product.shopId || seller._id === product.shopId
      ) || {
        id: product.shopId,
        _id: product.shopId,
        name: product.shopName,
        handle: product.shopHandle,
        avatar: product.shopAvatar,
        description: product.shopDescription,
        followers: product.shopFollowers,
        rating: product.shopRating,
      }
    : null;
  const shopHandle =
    shop?.handle || product?.shopHandle || slugify(shop?.name || product?.shopName || "");
  const shopPath = shopHandle ? `/shop/${shopHandle}` : "/products";

  const shopProductsCount = product
    ? allProducts.filter((item) => item.shopId === product.shopId).length
    : 0;
  const related = product
    ? allProducts
        .filter(
          (item) =>
            item.category === product.category &&
            (item.id || item._id) !== productId
        )
        .slice(0, 4)
    : [];

  useEffect(() => {
    if (!productId) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setQty(1);
    setSelectedImage(gallery[0] || product?.image || "");
    setCartNotice(null);
  }, [gallery, product?.image, productId]);

  useEffect(() => {
    if (!canAddMore) {
      setQty(0);
      return;
    }

    setQty((currentQty) =>
      Math.min(Math.max(currentQty || 1, 1), remainingToAdd)
    );
  }, [canAddMore, remainingToAdd]);

  useEffect(() => {
    if (!cartNotice) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCartNotice(null);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [cartNotice]);

  if ((productDetailsLoading || fallbackLoading) && !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0b0d] font-Poppins text-white">
        <p className="font-Playfair text-xl text-white/40">Loading details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0b0d] font-Poppins text-white">
        <div className="text-center">
          <p className="mb-4 font-Playfair text-xl text-white/40">
            Product not found
          </p>
          <Link
            to="/products"
            className="text-sm text-emerald-300 transition hover:text-white"
          >
            &larr; Back to products
          </Link>
        </div>
      </div>
    );
  }

  const trustBadges = [
    {
      Icon: FiTruck,
      label: "Free shipping",
      sub: "Orders over $80",
    },
    {
      Icon: FiPackage,
      label: soldOut ? "Sold out" : `${stock} in stock`,
      sub: soldOut ? "Restock required" : "Ready to dispatch",
      isError: soldOut,
    },
    {
      Icon: FiShield,
      label: "Buyer protection",
      sub: "Secure checkout",
    },
  ];

  const detailItems = [
    {
      label: "Availability",
      value: soldOut
        ? "Currently unavailable"
        : isEventItem
        ? "Offer is active and ready to order"
        : "In stock - ready to ship",
    },
    {
      label: isEventItem ? "Campaign" : "Orders",
      value: isEventItem ? product.status || "Live" : `${product.sold || 0}+ sold`,
    },
    { label: "Category", value: product.category || "Uncategorized" },
    {
      label: isEventItem ? "Offer Window" : "Shipping",
      value: isEventItem ? product.window || "Schedule pending" : "Dispatch in 2-3 business days",
    },
    { label: "Returns", value: "30-day easy returns" },
    { label: "Protection", value: "Secure checkout + buyer protection" },
  ];

  const cartStatusText = cartNotice?.text
    ? cartNotice.text
    : soldOut
    ? "Sold out."
    : !canAddMore
    ? "Stock limit reached."
    : inCart
    ? `${cartQty} in cart • ${remainingToAdd} left`
    : `${stock} in stock`;

  const addButtonLabel = soldOut
    ? "Sold out"
    : !canAddMore
    ? "Stock limit reached"
    : qty > 1
    ? `Add ${qty}`
    : inCart
    ? "Add more"
    : "Add to cart";

  const handleAddToCart = () => {
    if (!canAddMore) {
      setCartNotice({
        type: "error",
        text: "Stock limit reached.",
      });
      return;
    }

    const result = addToCart(product, qty);

    setCartNotice({
      type: result.success ? "success" : "error",
      text: result.success
        ? qty === 1
          ? "Item added to cart."
          : `${qty} items added to cart.`
        : result.message,
    });

    if (result.success) {
      setQty(1);
    }
  };

  const handleMessageSeller = () => {
    const sellerName = shop?.name || product.shopName || "seller";
    window.alert(`Starting a message thread with ${sellerName}.`);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] font-Poppins text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-24">
        <div className="mb-8 flex items-center gap-2 text-xs text-white/30">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="transition hover:text-white">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${encodeURIComponent(product.category || "")}`}
            className="transition hover:text-white"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="truncate text-white/60">{product.name}</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-[#111114]">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={`${productId}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`h-16 w-16 overflow-hidden rounded-xl border transition ${
                      image === selectedImage
                        ? "border-emerald-300/60"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {shop && (
                <Link
                  to={shopPath}
                  className="flex items-center gap-2 text-xs text-white/50 transition hover:text-white"
                >
                  <img
                    src={shop.avatar}
                    alt={shop.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {shop.name}
                </Link>
              )}
              <span className="text-white/20">|</span>
              <span className="text-xs text-white/30">{product.category}</span>
            </div>

            <h1 className="font-Playfair text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Stars rating={product.rating || 0} />
              </div>
              <span className="text-sm text-white/70">{product.rating || 0}</span>
              <span className="text-sm text-white/30">
                ({product.reviews?.length || 0} reviews)
              </span>
              <span className="text-sm text-white/30">|</span>
              <span className="text-sm text-white/30">
                {product.sold || 0} sold
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-semibold text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-white/30 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="rounded-xl bg-emerald-300 px-3 py-1 text-sm font-bold text-[#0b0b0d]">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm leading-relaxed text-white/60">
              {product.description}
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setQty((currentQty) => Math.max(1, currentQty - 1))}
                  disabled={!canAddMore || qty <= 1}
                  className={`flex h-11 w-11 items-center justify-center text-lg transition ${
                    !canAddMore || qty <= 1
                      ? "cursor-not-allowed text-white/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-medium text-white">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQty((currentQty) => Math.min(remainingToAdd, currentQty + 1))
                  }
                  disabled={!canAddMore || qty >= remainingToAdd}
                  className={`flex h-11 w-11 items-center justify-center text-lg transition ${
                    !canAddMore || qty >= remainingToAdd
                      ? "cursor-not-allowed text-white/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddMore}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                  soldOut
                    ? "border-rose-300/30 bg-rose-300/10 text-rose-200"
                    : cartNotice?.type === "error"
                    ? "border-rose-300/30 bg-rose-300/10 text-rose-200"
                    : cartNotice?.type === "success"
                    ? "border-emerald-300/30 bg-emerald-300/20 text-emerald-200"
                    : !canAddMore
                    ? "cursor-not-allowed border-amber-300/30 bg-amber-300/10 text-amber-200"
                    : "border-white bg-white text-[#0b0b0d] hover:-translate-y-0.5"
                }`}
              >
                <FiShoppingCart size={15} />
                {addButtonLabel}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                  liked
                    ? "border-emerald-300 bg-emerald-300/20 text-emerald-200"
                    : "border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white"
                }`}
                aria-label="Toggle wishlist"
              >
                <FiHeart size={16} fill={liked ? "currentColor" : "none"} />
              </button>
            </div>

            <p
              className={`text-xs ${
                cartNotice?.type === "error" || soldOut || !canAddMore
                  ? "text-rose-300"
                  : "text-emerald-300"
              }`}
            >
              {cartStatusText}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {trustBadges.map(({ Icon, label, sub, isError }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
                >
                  <div className="flex justify-center">
                    <Icon
                      size={16}
                      className={isError ? "text-rose-300" : "text-emerald-300"}
                    />
                  </div>
                  <p
                    className={`mt-1.5 text-[10px] font-medium ${
                      isError ? "text-rose-300" : "text-white/70"
                    }`}
                  >
                    {label}
                  </p>
                  <p className="text-[9px] text-white/30">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-[#111114] p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-widest text-white/30">
                  Product details
                </p>
                <h2 className="font-Playfair text-xl font-semibold text-white">
                  Full description
                </h2>
              </div>
              <span className="text-xs text-white/40">ID #{productId}</span>
            </div>

            <p className="text-sm leading-relaxed text-white/70">
              {product.description}
            </p>
            <p className="text-sm leading-relaxed text-white/50">
              Each item is quality-checked, ships within 2-3 business days, and
              is covered by a 30-day return window.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {detailItems.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="text-[10px] uppercase tracking-wide text-white/40">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            {tags.length > 0 && (
              <div className="pt-2">
                <p className="mb-2 text-[11px] uppercase tracking-wide text-white/40">
                  Highlights
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-[#111114] p-6">
            <Link
              to={shopPath}
              className="flex items-center gap-3 rounded-2xl transition hover:bg-white/[0.03] hover:px-2 hover:py-1 -mx-2 -my-1"
            >
              <img
                src={shop?.avatar || product.image}
                alt={shop?.name || product.shopName}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-white transition hover:text-emerald-200">
                  {shop?.name || product.shopName}
                </p>
                <p className="text-xs text-white/40">
                  {shop
                    ? `${shopProductsCount} products | ${shop.followers || 0} followers`
                    : "Trusted marketplace seller"}
                </p>
              </div>
            </Link>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Rating", value: `${shop?.rating || product.rating || 0} / 5` },
                { label: "Orders", value: `${product.sold || 0}+` },
                { label: "Category", value: product.category },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <p className="text-[10px] uppercase tracking-wide text-white/40">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            {shop?.description && (
              <p className="text-sm leading-relaxed text-white/60">
                {shop.description}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleMessageSeller}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/20"
              >
                <FiMessageSquare size={15} />
                Send Message
              </button>

              <Link
                to={shopPath}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-[#0b0b0d] transition hover:-translate-y-0.5"
              >
                Visit Shop
              </Link>
            </div>
          </div>
        </div>

            <div className="mt-16">
            <div className="mb-6">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-white/30">
                Customer feedback
              </p>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-Playfair text-2xl font-semibold text-white">
                  Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <AiFillStar size={16} className="text-emerald-300" />
                  <span className="text-lg font-semibold text-white">{product.rating || 0}</span>
                  <span className="text-sm text-white/40">({product.reviews ? product.reviews.length : 0})</span>
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full rounded-xl border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/20 mb-6"
              >
                Write a Review
              </button>
            ) : (
              <div className="mb-8 rounded-3xl border border-white/10 bg-[#111114] p-6 text-center">
                <p className="text-white/50">Please log in to leave a review.</p>
              </div>
            )}

            {showReviewForm && isAuthenticated && (
              <div className="mb-8 rounded-3xl border border-white/10 bg-[#111114] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white">Write a review</h3>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <ReviewForm
                  product={product}
                  orderId={productOrder?._id}
                  onReviewAdded={() => {
                    dispatch(getProductDetails(productId));
                    setShowReviewForm(false);
                  }}
                />
              </div>
            )}

            <div className="space-y-4" id="reviews-container">
             {(product.reviews || []).map((review, index) => (
               <div key={index} className="rounded-2xl border border-white/10 bg-[#111114]/50 p-6">
                 <div className="flex items-start justify-between gap-4">
                   <div className="flex items-center gap-3">
                     {review.user?.avatar ? (
                       <img src={review.user.avatar} alt={review.user.name} className="h-10 w-10 rounded-full object-cover" />
                     ) : (
                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-300/10">
                         <span className="text-sm font-medium text-emerald-300">
                           {(review.user?.name || "U")[0]}
                         </span>
                       </div>
                     )}
                     <div>
                       <p className="font-medium text-white">{review.user?.name || "Anonymous"}</p>
                       <p className="text-xs text-white/40">
                         {review.hasPurchased && <span className="text-emerald-300">✓ Verified Purchase</span>}
                         {!review.hasPurchased && "—"}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center gap-1">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <AiFillStar
                         key={star}
                         size={14}
                         className={star <= review.rating ? "text-emerald-300" : "text-white/10"}
                       />
                     ))}
                   </div>
                 </div>
                 <p className="mt-4 text-sm leading-relaxed text-white/70">{review.message}</p>
                 <p className="mt-3 text-xs text-white/30">
                   {new Date(review.createdAt).toLocaleDateString(undefined, {
                     year: "numeric",
                     month: "long",
                     day: "numeric",
                   })}
                 </p>
               </div>
             ))}

             {(product.reviews || []).length === 0 && (
               <div className="rounded-3xl border border-white/10 bg-[#111114] p-8 text-center">
                 <h3 className="font-Playfair text-xl font-semibold text-white">No reviews yet</h3>
                 <p className="mt-3 text-sm text-white/50">
                   Be the first to share your experience with this product.
                 </p>
               </div>
             )}
           </div>
         </div>

         {related.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-white/30">
                You might also like
              </p>
              <h2 className="font-Playfair text-2xl font-semibold text-white">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id || item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;