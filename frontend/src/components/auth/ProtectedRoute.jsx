import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-[#0b0b0d]" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
