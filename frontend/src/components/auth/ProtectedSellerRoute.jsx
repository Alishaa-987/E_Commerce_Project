import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import SellerPageLoader from "../seller/SellerPageLoader";

const ProtectedSellerRoute = ({ children }) => {
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const isSeller = localStorage.getItem("sellerAuth") === "true";

  useEffect(() => {
    if (!isSeller) {
      return undefined
    }

    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 450);

    return () => clearTimeout(timer);
  }, [isSeller, location.pathname]);

  if (!isSeller) {
    return <Navigate to="/seller-login" replace />;
  }

  if (isPageLoading) {
    return <SellerPageLoader label="Opening seller workspace" />;
  }

  return children;
};

export default ProtectedSellerRoute;
