import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import {
  ActivationPage,
  CartPage,
  CheckoutPage,
  LandingPage,
  LoginPage,
  ProductDetailPage,
  ProductsPage,
  ProfilePage,
  SellerActivationPage,
  SellerLoginPage,
  SellerSignupPage,
  SellerDashboardPage,
  ShopPage,
  SignupPage,
  WishlistPage,
} from "./pages";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProtectedSellerRoute from "./components/auth/ProtectedSellerRoute";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { loadUser } from "./redux/actions/user";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(loadUser());

  },[dispatch]);
  return (
    <BrowserRouter>
      <WishlistProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/activation/:activation_token" element={<ActivationPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/seller-activation/:activation_token" element={<SellerActivationPage />} />
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedSellerRoute>
                  <SellerDashboardPage />
                </ProtectedSellerRoute>
              }
            />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/shop/:handle" element={<ShopPage />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route path="/become-seller" element={<SellerSignupPage />} />
            <Route path="/seller-login" element={<SellerLoginPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
};

export default App;
