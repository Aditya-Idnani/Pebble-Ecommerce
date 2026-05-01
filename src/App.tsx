import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/stores/auth";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountOverview } from "@/components/account/AccountOverview";
import { AccountOrders, AccountOrderDetail } from "@/components/account/AccountOrders";
import { AccountWishlist } from "@/components/account/AccountWishlist";
import { AccountAddresses } from "@/components/account/AccountAddresses";
import { AccountPayments } from "@/components/account/AccountPayments";
import { AccountReviews } from "@/components/account/AccountReviews";
import { AccountNotifications } from "@/components/account/AccountNotifications";
import { AccountRewards } from "@/components/account/AccountRewards";
import { AccountProfile } from "@/components/account/AccountProfileSettings";
import { AccountSecurity } from "@/components/account/AccountSecurity";
import { AccountHelp } from "@/components/account/AccountHelp";
import Index from "./pages/Index.tsx";
import Shop from "./pages/Shop.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Collections from "./pages/Collections.tsx";
import About from "./pages/About.tsx";
import Sellers from "./pages/Sellers.tsx";
import Deals from "./pages/Deals.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import SellerOnboarding from "./pages/SellerOnboarding.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";
import NotFound from "./pages/NotFound.tsx";
import {
  SellerLayout,
  SellerOverviewPage,
  SellerProductsPage,
  SellerProductFormPage,
  SellerOrdersPage,
  SellerOrderDetailPage,
  SellerInventoryPage,
  SellerAnalyticsPage,
  SellerPayoutsPage,
  SellerDiscountsPage,
  SellerSettingsPage,
  SellerReviewsPage,
  SellerNotificationsPage,
  SellerHelpPage,
} from "./pages/SellerDashboard.tsx";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const initialize = useAuthStore(s => s.initialize);

  useEffect(() => {
    const unsub = initialize();
    return unsub;
  }, [initialize]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/about" element={<About />} />
      <Route path="/sellers" element={<Sellers />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
        <Route index element={<AccountOverview />} />
        <Route path="orders" element={<AccountOrders />} />
        <Route path="orders/:orderId" element={<AccountOrderDetail />} />
        <Route path="wishlist" element={<AccountWishlist />} />
        <Route path="addresses" element={<AccountAddresses />} />
        <Route path="payments" element={<AccountPayments />} />
        <Route path="reviews" element={<AccountReviews />} />
        <Route path="notifications" element={<AccountNotifications />} />
        <Route path="rewards" element={<AccountRewards />} />
        <Route path="profile" element={<AccountProfile />} />
        <Route path="security" element={<AccountSecurity />} />
        <Route path="help" element={<AccountHelp />} />
      </Route>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/seller/onboarding" element={<ProtectedRoute requiredRole="seller"><SellerOnboarding /></ProtectedRoute>} />
      <Route path="/seller" element={<ProtectedRoute requiredRole="seller"><SellerLayout /></ProtectedRoute>}>
        <Route index element={<SellerOverviewPage />} />
        <Route path="products" element={<SellerProductsPage />} />
        <Route path="products/new" element={<SellerProductFormPage />} />
        <Route path="products/:id/edit" element={<SellerProductFormPage />} />
        <Route path="orders" element={<SellerOrdersPage />} />
        <Route path="orders/:id" element={<SellerOrderDetailPage />} />
        <Route path="inventory" element={<SellerInventoryPage />} />
        <Route path="analytics" element={<SellerAnalyticsPage />} />
        <Route path="payouts" element={<SellerPayoutsPage />} />
        <Route path="discounts" element={<SellerDiscountsPage />} />
        <Route path="settings" element={<SellerSettingsPage />} />
        <Route path="reviews" element={<SellerReviewsPage />} />
        <Route path="notifications" element={<SellerNotificationsPage />} />
        <Route path="help" element={<SellerHelpPage />} />
      </Route>
      <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin" fallbackRole="/account"><div className="container py-12"><h1 className="font-display text-2xl">Admin Panel</h1><p className="font-body text-muted-foreground mt-2">Coming soon...</p></div></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppChrome = () => {
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller');

  return (
    <>
      {!isSellerRoute && <Header />}
      {!isSellerRoute && <CartDrawer />}
      <main className="min-h-screen">
        <AppRoutes />
      </main>
      {!isSellerRoute && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppChrome />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
