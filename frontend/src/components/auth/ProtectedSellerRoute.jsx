import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedSellerRoute = ({ children }) => {
  const isSeller = localStorage.getItem("sellerAuth") === "true";
  if (!isSeller) {
    return <Navigate to="/seller-login" replace />;
  }
  return children;
};

export default ProtectedSellerRoute;
