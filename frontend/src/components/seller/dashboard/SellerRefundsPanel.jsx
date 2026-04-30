import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSellerRefundOrders, updateRefundStatus } from "../../../redux/actions/order";
import { FiRefreshCw, FiArrowRight, FiCheckCircle, FiXCircle, FiInfo, FiUser } from "react-icons/fi";
import { format } from "timeago.js";

const SellerRefundsPanel = () => {
  const dispatch = useDispatch();
  const { currentSeller } = useSelector((state) => state.seller);
  const { sellerOrders, sellerOrdersLoading } = useSelector((state) => state.order);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (currentSeller) {
      dispatch(getSellerRefundOrders(currentSeller._id));
    }
  }, [dispatch, currentSeller]);

  const handleUpdateStatus = async (orderId, status) => {
    setLoadingAction(true);
    setStatusMessage({ text: "", type: "" });
    try {
        const res = await dispatch(updateRefundStatus(orderId, status));
        if (res.success) {
            setStatusMessage({ text: res.message || "Status updated!", type: "success" });
            // Refresh list
            dispatch(getSellerRefundOrders(currentSeller._id));
            setTimeout(() => {
                setSelectedOrder(null);
                setStatusMessage({ text: "", type: "" });
            }, 2000);
        } else {
            setStatusMessage({ text: res.message || "Failed to update status.", type: "error" });
        }
    } catch (error) {
        setStatusMessage({ text: "An error occurred.", type: "error" });
    } finally {
        setLoadingAction(false);
    }
  };

  const getStatusStyle = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
      case "processing":
      case "pending":
        return "bg-amber-400/10 text-amber-400 border-amber-400/20";
      case "approved":
      case "refunded":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      case "rejected":
        return "bg-rose-400/10 text-rose-400 border-rose-400/20";
      default:
        return "bg-white/10 text-white/50 border-white/10";
    }
  };

  if (sellerOrdersLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <FiRefreshCw className="animate-spin text-emerald-300" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] lg:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Return Requests</p>
            <h2 className="mt-2 text-2xl font-Playfair font-semibold text-white">Refund Orders</h2>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-300 border border-emerald-300/20 font-bold">
              {sellerOrders.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/30">
              <tr>
                <th className="pb-4 font-medium">Order ID</th>
                <th className="pb-4 font-medium">Refund Status</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sellerOrders.length > 0 ? (
                sellerOrders.map((order, index) => (
                  <tr 
                    key={order?._id || index} 
                    className={`group transition hover:bg-white/[0.02] ${selectedOrder?._id === order._id ? "bg-white/[0.04]" : ""}`}
                  >
                    <td className="py-4 font-medium text-white">{(order?._id || "").slice(-8).toUpperCase()}</td>
                    <td className="py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${getStatusStyle(order.refund?.status)}`}>
                        {order.refund?.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center text-[10px]">
                            <FiUser size={12} />
                        </div>
                        <span className="truncate max-w-[100px]">{order.user?.name || "Customer"}</span>
                    </td>
                    <td className="py-4 font-semibold text-white">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
                            selectedOrder?._id === order._id ? "bg-emerald-300 text-[#0b0b0d]" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <FiArrowRight size={14} className={selectedOrder?._id === order._id ? "rotate-90 transition-transform" : "transition-transform"} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-white/30 text-xs">
                    No active refund requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Detail View */}
      {selectedOrder && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 rounded-[28px] border border-white/10 bg-[#111114] p-6 lg:p-8 shadow-2xl border-l-4 border-emerald-300">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Refund Reason</p>
                        <div className="rounded-2xl bg-white/5 p-5 border border-white/10 italic text-white/80 leading-relaxed">
                            "{selectedOrder.refund?.reason || "No reason provided by customer."}"
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Requested On</p>
                            <p className="text-sm font-medium text-white">{selectedOrder.refund?.requestedAt ? format(selectedOrder.refund.requestedAt) : "Recently"}</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Payment Method</p>
                            <p className="text-sm font-medium text-white uppercase">{selectedOrder.paymentInfo?.type || "Standard"}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-72 space-y-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/30">Action Required</p>
                    
                    {statusMessage.text && (
                        <div className={`rounded-xl p-3 text-xs font-bold ${
                            statusMessage.type === "success" ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"
                        }`}>
                            {statusMessage.text}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button 
                            onClick={() => handleUpdateStatus(selectedOrder._id, "refunded")}
                            disabled={loadingAction}
                            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-300 px-6 py-4 text-sm font-bold text-[#0b0b0d] transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            <FiCheckCircle size={18} />
                            {loadingAction ? "Processing..." : "Approve Refund (Yes)"}
                        </button>
                        <button 
                            onClick={() => handleUpdateStatus(selectedOrder._id, "rejected")}
                            disabled={loadingAction}
                            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white/70 transition hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/20 disabled:opacity-50"
                        >
                            <FiXCircle size={18} />
                            {loadingAction ? "Processing..." : "Reject Request (No)"}
                        </button>
                    </div>
                    <div className="rounded-xl bg-amber-400/5 p-3 border border-amber-400/10 flex gap-2">
                        <FiInfo size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-400/80 leading-normal">
                            Approving will deduct <strong>${selectedOrder.totalPrice.toFixed(2)}</strong> from your balance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SellerRefundsPanel;
