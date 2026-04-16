import React, { useEffect, useState } from "react";
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
  SellerEventsPage,
  SellerOrdersPage,
  SellerProductsPage,
  SellerCreateProductPage,
  SellerCreateEventPage,
  SellerDiscountCodesPage,
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
import { LoadingUserFail } from "./redux/reducers/user";
import { getAllProducts } from "./redux/actions/product";
import { getAllShops } from "./redux/actions/seller";
import { getAllEvents } from "./redux/actions/event";
import { useDispatch } from "react-redux";
import { server } from "./server";
import axios from "axios";
import {Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentPage from "./pages/paymentPage";
const App = () => {
  const [stripeKey , setStripeKey] = useState("");
  const dispatch = useDispatch();

  const getStripeApiKey = async () => {
    const {data} = await axios.get(`${server}/payment/stripeapikey`);
    setStripeKey(data.stripeApiKey);
  };

  useEffect(() => {
    const shouldLoadUser =
      typeof window !== "undefined" && window.localStorage.getItem("userAuth") === "true";

    if (shouldLoadUser) {
      dispatch(loadUser());
    } else {
      dispatch(LoadingUserFail(null));
    }

    dispatch(getAllProducts());
    dispatch(getAllShops());
    dispatch(getAllEvents());
    getStripeApiKey();
  }, []);

  console.log(stripeKey);
  return (

    
    <BrowserRouter>
    {
      stripeKey && (
        <Elements stripe={loadStripe(stripeKey)}>
          <Routes>
        <Route 
        path="payment"
        element={
          <ProtectedRoute>
            <PaymentPage/>
          </ProtectedRoute>
        }
        />
            </Routes>
        </Elements> 
      )
}
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
              <Route path="events" element={<SellerEventsPage />} />
              <Route path="create-event" element={<SellerCreateEventPage />} />
              <Route
                path="withdraw-money"
                element={<SellerWorkspaceSectionPage sectionKey="withdrawMoney" />}
              />
              <Route path="inbox" element={<SellerInboxPage />} />
              <Route
                path="discount-codes"
                element={<SellerDiscountCodesPage />}
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
            <Route path="/shop/:handle" element={<ShopPage section="products" />} />
            <Route path="/shop/:handle/events" element={<ShopPage section="events" />} />
            <Route path="/shop/:handle/reviews" element={<ShopPage section="reviews" />} />
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
            <Route path="/become-seller" element={<Navigate to="/seller-login" replace />} />
            <Route path="/seller-signup" element={<SellerSignupPage />} />
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
