import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import SellerCreateCouponCodeModal from "../../components/seller/dashboard/SellerCreateCouponCodeModal";
import SellerDiscountCodesPanel from "../../components/seller/dashboard/SellerDiscountCodesPanel";
import { server } from "../../server";

const SellerDiscountCodesPage = () => {
  const { dashboardData } = useOutletContext();
  const { sellerProducts } = useSelector((state) => state.products);
  const sellerId =
    (typeof window !== "undefined" && window.localStorage.getItem("sellerId")) ||
    dashboardData?.sellerShop?._id ||
    dashboardData?.sellerShop?.id;
  const [couponCodes, setCouponCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const productOptions = useMemo(() => sellerProducts || [], [sellerProducts]);
  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          productOptions
            .map((product) => product.category?.trim())
            .filter(Boolean)
        )
      ),
    [productOptions]
  );

  useEffect(() => {
    const loadCouponCodes = async () => {
      if (!sellerId) {
        setError("Seller account id is missing. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data } = await axios.get(`${server}/coupon/get-all-coupon-codes-shop/${sellerId}`, {
          withCredentials: true,
        });
        setCouponCodes(data.couponCodes || []);
        setError("");
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Coupon codes could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCouponCodes();
  }, [sellerId]);

  const handleCreateCoupon = async (payload) => {
    if (!sellerId) {
      return {
        success: false,
        message: "Seller account id is missing. Please log in again.",
      };
    }

    try {
      const { data } = await axios.post(
        `${server}/coupon/create-coupon-code`,
        {
          ...payload,
          shopId: sellerId,
        },
        {
          withCredentials: true,
        }
      );

      setCouponCodes((current) => [data.couponCode, ...current]);
      setError("");

      return {
        success: true,
      };
    } catch (createError) {
      return {
        success: false,
        message: createError.response?.data?.message || "Coupon code could not be created.",
      };
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <p className="text-sm text-white/50">Loading discount codes...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="rounded-[30px] border border-white/10 bg-[#111114] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:px-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">
                Discount Codes
              </p>
              <h2 className="mt-2 text-3xl font-Playfair font-semibold text-white">
                Seller coupons
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Create coupon codes for your products and keep them organized in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0b0d] transition hover:-translate-y-0.5"
            >
              <FiPlus size={14} />
              Create Coupon Code
            </button>
          </div>
        </div>

        <SellerDiscountCodesPanel couponCodes={couponCodes} error={error} />
      </div>

      <SellerCreateCouponCodeModal
        isOpen={isFormOpen}
        productOptions={productOptions}
        categoryOptions={categoryOptions}
        onClose={() => setIsFormOpen(false)}
        onCreateCoupon={handleCreateCoupon}
      />
    </>
  );
};

export default SellerDiscountCodesPage;
