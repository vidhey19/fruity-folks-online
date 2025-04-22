
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedPage from "../components/AnimatedPage";
import SEO from "../components/SEO";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loadRazorpayScript, createRazorpayOrder, openRazorpayCheckout, verifyRazorpayPayment } from "../services/razorpay";
import { trackEvent } from "../services/monitoring";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, total, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed with checkout");
      navigate("/auth?redirect=checkout");
    }
    
    if (items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/shop");
    }
    
    // Load Razorpay script
    loadRazorpayScript().then(isLoaded => {
      setIsRazorpayLoaded(isLoaded);
      if (!isLoaded) {
        toast.error("Could not load payment gateway. Please try again later.");
      }
    });
    
    // Prefill form with user data if available
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [isAuthenticated, items, navigate, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const required = ["name", "email", "phone", "address", "city", "state", "pincode"];
    const emptyFields = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      toast.error(`Please fill all required fields: ${emptyFields.join(", ")}`);
      return;
    }
    
    if (!isRazorpayLoaded) {
      toast.error("Payment gateway is not loaded. Please refresh and try again.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order in Razorpay
      const receipt = `rcpt_${Date.now()}`;
      const orderResponse = await createRazorpayOrder(total, receipt);
      
      if (!orderResponse.success) {
        throw new Error("Failed to create order");
      }
      
      // Prepare order products data
      const orderProducts = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.salePrice || item.price,
        quantity: item.quantity
      }));
      
      // Prepare order details
      const orderDetails = {
        products: orderProducts,
        total,
        shippingAddress: formData,
      };
      
      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: "AmritNaturals",
        description: "Payment for mango products",
        order_id: orderResponse.order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
        },
        theme: {
          color: "#9b87f5"
        }
      };
      
      const paymentResponse = await openRazorpayCheckout(options);
      
      // Verify payment
      const verificationResponse = await verifyRazorpayPayment(
        paymentResponse,
        orderDetails
      );
      
      if (verificationResponse.success) {
        // Track successful purchase
        trackEvent('ecommerce', 'purchase', 'checkout_complete', total);
        
        // Clear cart and redirect to success page
        clearCart();
        navigate(`/order-success?id=${verificationResponse.orderId}`);
        toast.success("Payment successful! Your order has been placed.");
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again later.");
      
      // Track failed purchase
      trackEvent('ecommerce', 'purchase_failed', 'checkout_error', total);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Checkout" 
        description="Complete your purchase of premium mango products from AmritNaturals."
        ogType="website"
      />
      <Navbar />
      
      <AnimatedPage>
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping Information */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  
                  <form onSubmit={handlePayment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          id="pincode"
                          name="pincode"
                          type="text"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-1">x{item.quantity}</span>
                        </div>
                        <div>
                          {formatPrice((item.salePrice || item.price) * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePayment}
                    disabled={isSubmitting || !isRazorpayLoaded || items.length === 0}
                    className="w-full bg-primary hover:bg-primary/90 py-3"
                  >
                    {isSubmitting ? "Processing..." : "Pay Now"}
                  </Button>
                  
                  <div className="mt-4 text-xs text-center text-gray-500">
                    <p>Secure payment powered by Razorpay</p>
                    <p className="mt-1">By completing this order, you agree to our Terms of Service and Privacy Policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default Checkout;
