
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "./services/monitoring";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import OrderSuccess from "./pages/OrderSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  
  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={
                      <AdminRoute>
                        <Admin />
                      </AdminRoute>
                    } />
                    <Route path="/admin-auth" element={<AdminAuth />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/account" element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } />
                    <Route path="/wishlist" element={<Wishlist />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
                <Toaster />
                <Sonner position="bottom-right" closeButton />
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
