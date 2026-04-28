import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiArrowUpRight, FiFilter } from "react-icons/fi";
import { formatSellerCurrency } from "../sellerSession";
import { format } from "timeago.js";

const SellerWithdrawPanel = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  const { sellerOrders } = useSelector((state) => state.order);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  
  // Calculate real revenue using EXACT SAME logic as main dashboard
  const totalRevenue = (sellerOrders || [])
    .filter(order => order.status !== "Refund Success" && order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  
  // Available balance is now 1:1 with net revenue to ensure consistency
  const availableBalance = totalRevenue;

  // Real transactions based on orders
  const transactions = [...(sellerOrders || [])]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 15);

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    if (Number(withdrawAmount) > availableBalance) {
        alert("Insufficient balance.");
        return;
    }
    alert(`Withdraw request for $${withdrawAmount} submitted!`);
    setWithdrawAmount("");
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Balance Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-[32px] border border-white/10 bg-[#111114] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <FiDollarSign size={80} className="text-emerald-300" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/35">Available Balance</p>
            <h2 className="mt-3 text-5xl font-Playfair font-bold text-white">
                {formatSellerCurrency(availableBalance)}
            </h2>
            <p className="mt-4 text-sm text-white/45 max-w-sm">
                Total earnings from all successful shop transactions.
            </p>
            
            <div className="mt-10 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-white/70">Verified Seller</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-white/70">Matching Dashboard Data</span>
                </div>
            </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-emerald-300 p-8 flex flex-col justify-between">
            <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#0b0b0d]/50 font-bold">Payouts</p>
                <h3 className="mt-2 text-2xl font-Playfair font-bold text-[#0b0b0d]">Withdraw Funds</h3>
            </div>
            <form onSubmit={handleWithdraw} className="mt-6 space-y-3">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0b0b0d]/60 font-bold">$</span>
                    <input 
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full rounded-2xl border-none bg-black/10 py-4 pl-8 pr-4 text-sm font-bold text-[#0b0b0d] placeholder:text-[#0b0b0d]/30 focus:ring-2 focus:ring-[#0b0b0d]/20"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full rounded-2xl bg-[#0b0b0d] py-4 text-sm font-bold text-white transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/20"
                >
                    Submit Request
                </button>
            </form>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="rounded-[32px] border border-white/10 bg-[#111114] p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/35">Statement</p>
                <h3 className="mt-2 text-2xl font-Playfair font-semibold text-white">Recent Transactions</h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Income
                <span className="h-2 w-2 rounded-full bg-rose-400 ml-3" /> Refund
            </div>
        </div>

        <div className="space-y-4">
            {/* Header row */}
            <div className="grid grid-cols-4 px-6 text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">
                <span>Reference</span>
                <span>Date</span>
                <span>Amount</span>
                <span className="text-right">Status</span>
            </div>

            {/* List */}
            {transactions.length > 0 ? (
                transactions.map((order, index) => {
                    const isRefunded = order.status === "Refund Success";
                    return (
                        <div key={order?._id || index} className={`grid grid-cols-4 items-center rounded-2xl border p-6 transition hover:bg-white/[0.04] ${
                            isRefunded ? "bg-rose-500/[0.02] border-rose-500/10" : "bg-white/[0.02] border-white/5"
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                    isRefunded ? "bg-rose-500/10 text-rose-500" : "bg-emerald-300/10 text-emerald-300"
                                }`}>
                                    {isRefunded ? <FiAlertCircle size={18} /> : <FiArrowUpRight size={18} />}
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-white uppercase">{(order?._id || "").slice(-8)}</span>
                                    <p className={`text-[9px] font-bold uppercase mt-0.5 ${isRefunded ? "text-rose-500/60" : "text-emerald-300/60"}`}>
                                        {isRefunded ? "Deduction" : "Sale"}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm text-white/40">{order.updatedAt ? format(order.updatedAt) : "Just now"}</span>
                            <span className={`text-sm font-bold ${isRefunded ? "text-rose-300" : "text-white"}`}>
                                {isRefunded ? "-" : "+"}${order.totalPrice?.toFixed(2) || "0.00"}
                            </span>
                            <div className="flex justify-end">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                    isRefunded 
                                        ? "bg-rose-500/10 text-rose-300 border border-rose-500/20" 
                                        : "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="py-12 text-center text-white/20 text-sm italic">
                    No transactions recorded yet.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SellerWithdrawPanel;
