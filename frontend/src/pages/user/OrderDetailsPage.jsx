import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
  FiMessageSquare,
  FiStar,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ReviewForm from "../../components/product/ReviewForm";
import RefundRequestForm from "../../components/order/RefundRequestForm";
import { getOrderDetails } from "../../redux/actions/order";
import { toAbsoluteAssetUrl } from "../../utils/marketplace";

const formatReadableDate = (value, fallback = "Recently") => {
  if (!value) {
    return fallback;
  }
  
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
    
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusStyle = (status = "") => {
  const styles = {
    pending: { color: "text-amber-200", bg: "bg-amber-300/20", border: "border-amber-300/30", dot: "bg-amber-300" },
    processing: { color: "text-sky-200", bg: "bg-sky-300/20", border: "border-sky-300/30", dot: "bg-sky-300" },
    shipped: { color: "text-sky-200", bg: "bg-sky-300/20", border: "border-sky-300/30", dot: "bg-sky-300" },
    delivered: { color: "text-emerald-200", bg: "bg-emerald-300/20", border: "border-emerald-300/30", dot: "bg-emerald-300" },
    cancelled: { color: "text-rose-200", bg: "bg-rose-300/20", border: "border-rose-300/30", dot: "bg-rose-300" },
  };
  return styles[status.toLowerCase()] || { color: "text-white", bg: "bg-white/10", border: "border-white/10", dot: "bg-white/40" };
};

const formatCurrency = (value = 0) => `$${Number(value || 0).toFixed(2)}`;

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orderDetails, orderDetailsLoading, orderDetailsError } = useSelector(
    (state) => state.order
  );
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundingItem, setRefundingItem] = useState(null);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const order = orderDetails;
  const statusStyle = getStatusStyle(order?.orderStatus);

  const deliveredItems = useMemo(() => {
    if (!order?.cart) return [];
    return order.cart.filter((item) => !item.reviewSubmitted);
  }, [order?.cart]);

  const reviewedItems = useMemo(() => {
    if (!order?.cart) return [];
    return order.cart.filter((item) => item.reviewSubmitted);
  }, [order?.cart]);

  if (orderDetailsLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 pt-32 pb-16 text-center">
          <p className="text-white/50">Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderDetailsError || !order) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 pt-32 pb-16 text-center">
          <p className="text-rose-300">{orderDetailsError || "Order not found"}</p>
          <Link
            to="/profile?tab=orders"
            className="mt-4 inline-block text-sm text-emerald-300 hover:text-white"
          >
            ← Back to Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-6 pt-32 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/profile?tab=orders"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-4"
          >
            <FiArrowLeft size={14} /> Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-Playfair text-2xl font-semibold text-white">
                Order {order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-white/40 mt-1">
                Placed on {formatReadableDate(order.createdAt)}
              </p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Order Status Section */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 mb-6">
          <h2 className="font-Playfair text-lg font-semibold text-white mb-4">
            <FiPackage className="inline mr-2" /> Order Status
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-4">
              <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Status</p>
              <p className={`font-semibold ${statusStyle.color}`}>{order.orderStatus}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-4">
              <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Payment</p>
              <p className="font-semibold text-white">{order.paymentMethod || "Card"}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-4">
              <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Total</p>
              <p className="font-semibold text-white">{formatCurrency(order.totalPrice)}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#0b0b0d] p-4">
              <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Shop</p>
              <p className="font-semibold text-white truncate">{order.shopName || "Shop"}</p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mt-6 flex items-center gap-4">
            <div className={`h-3 w-3 rounded-full ${order.orderStatus !== 'cancelled' ? 'bg-emerald-300' : 'bg-rose-300'}`} />
            <span className="text-sm text-white/70">
              {order.orderStatus === 'delivered' ? (
                <span className="text-emerald-300"><FiCheckCircle className="inline mr-1" /> Delivered on {formatReadableDate(order.deliveredAt)}</span>
              ) : order.orderStatus === 'cancelled' ? (
                <span className="text-rose-300"><FiXCircle className="inline mr-1" /> Order Cancelled</span>
              ) : (
                <span className="text-amber-300"><FiClock className="inline mr-1" /> {order.orderStatus} - Last updated {formatReadableDate(order.updatedAt)}</span>
              )}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 mb-6">
          <h2 className="font-Playfair text-lg font-semibold text-white mb-4">
            Items in this Order
          </h2>
          <div className="space-y-4">
            {(order.cart || []).map((item) => (
              <div
                key={item._id || item.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-[#0b0b0d] p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={toAbsoluteAssetUrl(
                      (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null) || 
                      item.image || 
                      (typeof item.images === 'string' ? item.images : null)
                    )}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-white/40">
                      {formatCurrency(item.discountPrice || item.price)} x {item.qty}
                    </p>
                  </div>
                </div>

                {/* Show Review/Refund buttons for delivered orders */}
                {order.orderStatus === 'delivered' && (
                  <div className="flex items-center gap-3">
                    {!item.reviewSubmitted ? (
                      <button
                        onClick={() => {
                          setReviewingItem(item);
                          setShowReviewForm(true);
                        }}
                        className="text-xs font-medium text-emerald-300 border border-emerald-300/30 rounded px-3 py-1.5 hover:bg-emerald-300/10 transition"
                      >
                        <FiStar className="inline mr-1" /> Write Review
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-white/40 px-3 py-1.5 border border-white/5 rounded bg-white/5">
                        Reviewed
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Give Review Section */}
        {order.orderStatus === 'delivered' && deliveredItems.length > 0 && (
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6 mb-6">
            <h2 className="font-Playfair text-lg font-semibold text-white mb-2">
              <FiMessageSquare className="inline mr-2" /> Give Review
            </h2>
            <p className="text-sm text-white/60 mb-4">
              Share your experience with the items you received.
            </p>
            {!showReviewForm ? (
              <div className="space-y-3">
                {deliveredItems.map((item) => (
                  <div key={item._id || item.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0b0b0d] p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={toAbsoluteAssetUrl(item.images?.[0] || item.image || (typeof item.images === 'string' ? item.images : null))}
                        alt={item.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setReviewingItem(item);
                        setShowReviewForm(true);
                      }}
                      className="text-xs font-medium text-emerald-300 border border-emerald-300/30 rounded px-3 py-1.5 hover:bg-emerald-300/10 transition"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewingItem(null);
                  }}
                  className="mb-4 text-xs text-white/50 hover:text-white"
                >
                  ✕ Cancel
                </button>
                <ReviewForm
                  product={reviewingItem}
                  orderId={order._id}
                  onReviewAdded={() => {
                    dispatch(getOrderDetails(orderId));
                    setShowReviewForm(false);
                    setReviewingItem(null);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Reviews Already Given Section */}
        {reviewedItems.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 mb-6">
            <h2 className="font-Playfair text-lg font-semibold text-white mb-4">
              <FiStar className="inline mr-2 text-emerald-300" /> Reviews Given
            </h2>
            <div className="space-y-3">
              {reviewedItems.map((item) => (
                <div key={item._id || item.id} className="rounded-lg border border-white/5 bg-[#0b0b0d] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={toAbsoluteAssetUrl(item.images?.[0] || item.image || (typeof item.images === 'string' ? item.images : null))}
                      alt={item.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-emerald-300">✓ Reviewed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demand Refund Section */}
        {order.orderStatus === 'delivered' && (
          <div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-6 mb-6">
            <h2 className="font-Playfair text-lg font-semibold text-white mb-2">
              <FiRefreshCw className="inline mr-2" /> Demand Refund
            </h2>
            {order.refund?.requested ? (
              <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-lg text-sm">
                Refund Status: {order.refund.status || "Pending"}
              </div>
            ) : !showRefundForm ? (
              <>
                <p className="text-sm text-white/60 mb-4">
                  Need a refund? Request one if there's an issue with your order.
                </p>
                <button
                  onClick={() => {
                    setRefundingItem(order);
                    setShowRefundForm(true);
                  }}
                  className="text-xs font-semibold text-rose-300 border border-rose-300/30 rounded px-4 py-2 hover:bg-rose-300/10 transition"
                >
                  Request Refund
                </button>
              </>
            ) : (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setShowRefundForm(false);
                    setRefundingItem(null);
                  }}
                  className="mb-4 text-xs text-white/50 hover:text-white"
                >
                  ✕ Cancel
                </button>
                <RefundRequestForm
                  order={order}
                  onRefundRequested={() => {
                    dispatch(getOrderDetails(orderId));
                    setShowRefundForm(false);
                    setRefundingItem(null);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
