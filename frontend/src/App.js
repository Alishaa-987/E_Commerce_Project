import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
  SellerProfilePage,
  SellerSignupPage,
  SellerDashboardPage,
  SellerOrdersPage,
  SellerProductsPage,
  SellerCreateProductPage,
  SellerInboxPage,
  SellerWorkspaceSectionPage,
  ShopPage,
  SignupPage,
  WishlistPage,
} from "./pages";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProtectedSellerRoute from "./components/auth/ProtectedSellerRoute";
import SellerWorkspaceLayout from "./components/seller/dashboard/SellerWorkspaceLayout";
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
              path="/seller/profile"
              element={
                <ProtectedSellerRoute>
                  <SellerProfilePage />
                </ProtectedSellerRoute>
              }
            />
            <Route
              path="/seller"
              element={
                <ProtectedSellerRoute>
                  <SellerWorkspaceLayout />
                </ProtectedSellerRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SellerDashboardPage />} />
              <Route path="orders" element={<SellerOrdersPage />} />
              <Route path="products" element={<SellerProductsPage />} />
              <Route path="create-product" element={<SellerCreateProductPage />} />
              <Route
                path="events"
                element={<SellerWorkspaceSectionPage sectionKey="allEvents" />}
              />
              <Route
                path="create-event"
                element={<SellerWorkspaceSectionPage sectionKey="createEvent" />}
              />
              <Route
                path="withdraw-money"
                element={<SellerWorkspaceSectionPage sectionKey="withdrawMoney" />}
              />
              <Route path="inbox" element={<SellerInboxPage />} />
              <Route
                path="discount-codes"
                element={<SellerWorkspaceSectionPage sectionKey="discountCodes" />}
              />
              <Route
                path="refunds"
                element={<SellerWorkspaceSectionPage sectionKey="refunds" />}
              />
              <Route
                path="settings"
                element={<SellerWorkspaceSectionPage sectionKey="settings" />}
              />
            </Route>
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
