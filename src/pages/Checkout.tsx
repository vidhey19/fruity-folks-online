
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedPage from "../components/AnimatedPage";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { fadeIn } from "../utils/animations";
import { toast } from "sonner";
import {
  CreditCard,
  Wallet,
  Lock,
  Check,
  ChevronsRight,
  MapPin,
  Truck,
  ShoppingBag,
  Smartphone
} from "lucide-react";

// List of Indian states
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
];

// Countries list (abbreviated)
const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "China", "Japan", 
  "Germany", "France", "Italy", "Spain", "Russia", "Brazil", "Mexico", "South Africa", 
  "Saudi Arabia", "UAE", "Singapore", "Malaysia", "Thailand"
];

// Sample postal code to city mapping for demo
const postalCodeToCity: Record<string, { city: string, state: string }> = {
  "110001": { city: "New Delhi", state: "Delhi" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "226001": { city: "Lucknow", state: "Uttar Pradesh" },
  "800001": { city: "Patna", state: "Bihar" },
  "302001": { city: "Jaipur", state: "Rajasthan" }
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate("/auth?redirect=checkout");
    return null;
  }
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [orderProcessing, setOrderProcessing] = useState(false);
  
  // Form data states
  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: ""
  });
  
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  const [upiForm, setUpiForm] = useState({
    upiId: ""
  });
  
  const subtotal = cart.totalPrice;
  const shipping = deliveryMethod === "express" ? 249 : deliveryMethod === "standard" ? 99 : 0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };
  
  const handleShippingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill city and state based on postal code
    if (name === "postalCode" && value.length === 6) {
      const locationInfo = postalCodeToCity[value];
      if (locationInfo) {
        setShippingForm(prev => ({
          ...prev,
          city: locationInfo.city,
          state: locationInfo.state
        }));
        toast.success(`Found location: ${locationInfo.city}, ${locationInfo.state}`);
      }
    }
  };
  
  const handleCardFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpiFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpiForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContinue = () => {
    // Validate current step
    if (currentStep === 1) {
      // Validate shipping info
      const requiredFields = ['fullName', 'email', 'address', 'city', 'state', 'postalCode', 'phone'];
      const emptyFields = requiredFields.filter(field => !shippingForm[field as keyof typeof shippingForm]);
      
      if (emptyFields.length > 0) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    
    // If validation passes, go to next step
    setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmitOrder = async () => {
    // Validate payment details based on method
    if (paymentMethod === "card") {
      const { cardNumber, cardName, expiryDate, cvv } = cardForm;
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error("Please fill in all card details");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiForm.upiId) {
        toast.error("Please enter your UPI ID");
        return;
      }
    }
    
    setOrderProcessing(true);
    
    // Simulate order processing and Google Sheets submission
    try {
      // Simulate Google Sheets submission
      const orderData = {
        orderId: `ORD-${Date.now()}`,
        customer: shippingForm.fullName,
        email: shippingForm.email,
        phone: shippingForm.phone,
        address: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state}, ${shippingForm.postalCode}, ${shippingForm.country}`,
        items: cart.items.map(item => `${item.name} x${item.quantity}`).join(", "),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        paymentMethod: paymentMethod,
        orderDate: new Date().toISOString()
      };
      
      console.log("Order submitted to Google Sheets:", orderData);
      
      // In a real app, you would submit this data to Google Sheets via an API
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to success page
      navigate("/order-success");
      
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setOrderProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <AnimatedPage>
        <main className="py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>
            
            {/* Checkout Process Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    <MapPin size={20} />
                  </div>
                  <span className="text-sm">Shipping</span>
                </div>
                
                <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                
                <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Truck size={20} />
                  </div>
                  <span className="text-sm">Delivery</span>
                </div>
                
                <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                
                <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    <CreditCard size={20} />
                  </div>
                  <span className="text-sm">Payment</span>
                </div>
                
                <div className={`flex-1 h-1 mx-2 ${currentStep >= 4 ? 'bg-primary' : 'bg-muted'}`}></div>
                
                <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 4 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    <ShoppingBag size={20} />
                  </div>
                  <span className="text-sm">Review</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="w-full lg:w-2/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  {/* Step 1: Shipping Information */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-medium mb-6">Shipping Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={shippingForm.fullName}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={shippingForm.email}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={shippingForm.address}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={shippingForm.postalCode}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter 6-digit PIN code"
                            maxLength={6}
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">Enter PIN code to auto-fill city and state</p>
                        </div>
                        
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingForm.city}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium mb-2">
                            State/UT *
                          </label>
                          <select
                            id="state"
                            name="state"
                            value={shippingForm.state}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          >
                            <option value="">Select State</option>
                            {indianStates.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium mb-2">
                            Country *
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={shippingForm.country}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          >
                            {countries.map(country => (
                              <option key={country} value={country}>{country}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={shippingForm.phone}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="10-digit mobile number"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Delivery Options */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-medium mb-6">Delivery Options</h2>
                      
                      <div className="space-y-4">
                        <div
                          className={`border ${
                            deliveryMethod === "standard" ? "border-primary" : "border-border"
                          } rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors`}
                          onClick={() => setDeliveryMethod("standard")}
                        >
                          <div className="flex items-start">
                            <div className={`h-5 w-5 rounded-full border mr-3 mt-1 flex items-center justify-center ${
                              deliveryMethod === "standard" ? "border-primary bg-primary/10" : "border-muted-foreground"
                            }`}>
                              {deliveryMethod === "standard" && <Check size={12} className="text-primary" />}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <h3 className="font-medium">Standard Delivery</h3>
                                <span className="font-medium">{formatPrice(99)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Delivery within 3-5 business days
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div
                          className={`border ${
                            deliveryMethod === "express" ? "border-primary" : "border-border"
                          } rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors`}
                          onClick={() => setDeliveryMethod("express")}
                        >
                          <div className="flex items-start">
                            <div className={`h-5 w-5 rounded-full border mr-3 mt-1 flex items-center justify-center ${
                              deliveryMethod === "express" ? "border-primary bg-primary/10" : "border-muted-foreground"
                            }`}>
                              {deliveryMethod === "express" && <Check size={12} className="text-primary" />}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <h3 className="font-medium">Express Delivery</h3>
                                <span className="font-medium">{formatPrice(249)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Delivery within 1-2 business days
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div
                          className={`border ${
                            deliveryMethod === "pickup" ? "border-primary" : "border-border"
                          } rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors`}
                          onClick={() => setDeliveryMethod("pickup")}
                        >
                          <div className="flex items-start">
                            <div className={`h-5 w-5 rounded-full border mr-3 mt-1 flex items-center justify-center ${
                              deliveryMethod === "pickup" ? "border-primary bg-primary/10" : "border-muted-foreground"
                            }`}>
                              {deliveryMethod === "pickup" && <Check size={12} className="text-primary" />}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <h3 className="font-medium">Store Pickup</h3>
                                <span className="font-medium">Free</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Pick up your order at our local store
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Payment Method */}
                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-medium mb-6">Payment Method</h2>
                      
                      <div className="space-y-6">
                        {/* Payment Method Selection */}
                        <div className="space-y-4">
                          <div
                            className={`border ${
                              paymentMethod === "card" ? "border-primary" : "border-border"
                            } rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors`}
                            onClick={() => setPaymentMethod("card")}
                          >
                            <div className="flex items-center">
                              <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                                paymentMethod === "card" ? "border-primary bg-primary/10" : "border-muted-foreground"
                              }`}>
                                {paymentMethod === "card" && <Check size={12} className="text-primary" />}
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">Credit/Debit Card</h3>
                                <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay, American Express</p>
                              </div>
                              <CreditCard size={20} className="text-muted-foreground" />
                            </div>
                          </div>

                          <div
                            className={`border ${
                              paymentMethod === "upi" ? "border-primary" : "border-border"
                            } rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors`}
                            onClick={() => setPaymentMethod("upi")}
                          >
                            <div className="flex items-center">
                              <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                                paymentMethod === "upi" ? "border-primary bg-primary/10" : "border-muted-foreground"
                              }`}>
                                {paymentMethod === "upi" && <Check size={12} className="text-primary" />}
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">UPI Payment</h3>
                                <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM UPI</p>
                              </div>
                              <Smartphone size={20} className="text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div
                            className={`border ${
                              paymentMethod === "netbanking" ? "border-primary" : "border-border"
                            } rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors`}
                            onClick={() => setPaymentMethod("netbanking")}
                          >
                            <div className="flex items-center">
                              <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                                paymentMethod === "netbanking" ? "border-primary bg-primary/10" : "border-muted-foreground"
                              }`}>
                                {paymentMethod === "netbanking" && <Check size={12} className="text-primary" />}
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">Net Banking</h3>
                                <p className="text-xs text-muted-foreground">All major Indian banks supported</p>
                              </div>
                              <Wallet size={20} className="text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div
                            className={`border ${
                              paymentMethod === "cod" ? "border-primary" : "border-border"
                            } rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors`}
                            onClick={() => setPaymentMethod("cod")}
                          >
                            <div className="flex items-center">
                              <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                                paymentMethod === "cod" ? "border-primary bg-primary/10" : "border-muted-foreground"
                              }`}>
                                {paymentMethod === "cod" && <Check size={12} className="text-primary" />}
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">Cash on Delivery</h3>
                                <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                              </div>
                              <CreditCard size={20} className="text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Credit Card Form */}
                        {paymentMethod === "card" && (
                          <div className="mt-6 border-t border-border pt-6">
                            <h3 className="font-medium mb-4">Card Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="md:col-span-2">
                                <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                                  Card Number
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardForm.cardNumber}
                                    onChange={handleCardFormChange}
                                    className="w-full rounded-lg border border-border px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                  <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                </div>
                              </div>
                              
                              <div className="md:col-span-2">
                                <label htmlFor="cardName" className="block text-sm font-medium mb-2">
                                  Cardholder Name
                                </label>
                                <input
                                  type="text"
                                  id="cardName"
                                  name="cardName"
                                  placeholder="John Doe"
                                  value={cardForm.cardName}
                                  onChange={handleCardFormChange}
                                  className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  id="expiryDate"
                                  name="expiryDate"
                                  placeholder="MM/YY"
                                  value={cardForm.expiryDate}
                                  onChange={handleCardFormChange}
                                  className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                                  CVV
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    placeholder="123"
                                    value={cardForm.cvv}
                                    onChange={handleCardFormChange}
                                    className="w-full rounded-lg border border-border px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                  <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* UPI Form */}
                        {paymentMethod === "upi" && (
                          <div className="mt-6 border-t border-border pt-6">
                            <h3 className="font-medium mb-4">UPI Details</h3>
                            
                            <div>
                              <label htmlFor="upiId" className="block text-sm font-medium mb-2">
                                UPI ID
                              </label>
                              <input
                                type="text"
                                id="upiId"
                                name="upiId"
                                placeholder="yourname@upi"
                                value={upiForm.upiId}
                                onChange={handleUpiFormChange}
                                className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                              <p className="text-xs text-muted-foreground mt-1">Enter your UPI ID (e.g., name@okicici or name@ybl)</p>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-4 gap-2">
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">Google Pay</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">PhonePe</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Paytm_logo.png/640px-Paytm_logo.png" alt="Paytm" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">Paytm</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="BHIM UPI" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">BHIM UPI</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Net Banking Form */}
                        {paymentMethod === "netbanking" && (
                          <div className="mt-6 border-t border-border pt-6">
                            <h3 className="font-medium mb-4">Net Banking</h3>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/State_Bank_of_India_logo.svg" alt="SBI" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">SBI</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/9f/HDFC_Bank_Logo.svg" alt="HDFC" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">HDFC Bank</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/ICICI_Bank_Logo.svg" alt="ICICI" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">ICICI Bank</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Axis_Bank_logo.svg" alt="Axis Bank" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">Axis Bank</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Punjab_National_Bank_Logo.svg" alt="PNB" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">PNB</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Kotak_Mahindra_Bank_logo.svg/1200px-Kotak_Mahindra_Bank_logo.svg.png" alt="Kotak" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">Kotak</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/BOB_Blue.png" alt="Bank of Baroda" className="h-6 mx-auto mb-1" />
                                <span className="text-xs">BOB</span>
                              </div>
                              <div className="p-3 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                                <span className="text-xs">+ More Banks</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* COD Info */}
                        {paymentMethod === "cod" && (
                          <div className="mt-6 border-t border-border pt-6">
                            <p className="text-muted-foreground">
                              Pay with cash upon delivery. Please keep exact change handy to help our delivery executive. Available for orders under ₹10,000.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Step 4: Review Order */}
                  {currentStep === 4 && (
                    <div>
                      <h2 className="text-xl font-medium mb-6">Review Your Order</h2>
                      
                      <div className="space-y-6">
                        {/* Order Items */}
                        <div>
                          <h3 className="font-medium text-sm uppercase text-muted-foreground mb-3">Items ({cart.totalItems})</h3>
                          
                          <div className="space-y-4">
                            {cart.items.map((item) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="w-16 h-16 bg-white rounded-md overflow-hidden">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <span className="font-medium">
                                    ₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Shipping Information */}
                        <div className="border-t border-border pt-6">
                          <h3 className="font-medium text-sm uppercase text-muted-foreground mb-3">Shipping Address</h3>
                          
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <p className="font-medium">{shippingForm.fullName}</p>
                            <p>{shippingForm.address}</p>
                            <p>{shippingForm.city}, {shippingForm.state} {shippingForm.postalCode}</p>
                            <p>{shippingForm.country}</p>
                            <p>{shippingForm.phone}</p>
                            <p>{shippingForm.email}</p>
                          </div>
                        </div>
                        
                        {/* Delivery Method */}
                        <div className="border-t border-border pt-6">
                          <h3 className="font-medium text-sm uppercase text-muted-foreground mb-3">Delivery Method</h3>
                          
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <p className="font-medium">
                              {deliveryMethod === "standard" && "Standard Delivery (3-5 business days)"}
                              {deliveryMethod === "express" && "Express Delivery (1-2 business days)"}
                              {deliveryMethod === "pickup" && "Store Pickup"}
                            </p>
                          </div>
                        </div>
                        
                        {/* Payment Method */}
                        <div className="border-t border-border pt-6">
                          <h3 className="font-medium text-sm uppercase text-muted-foreground mb-3">Payment Method</h3>
                          
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <div className="flex items-center">
                              {paymentMethod === "card" && (
                                <>
                                  <CreditCard size={20} className="mr-2 text-muted-foreground" />
                                  <span>Card ending in {cardForm.cardNumber.slice(-4) || "****"}</span>
                                </>
                              )}
                              
                              {paymentMethod === "upi" && (
                                <>
                                  <Smartphone size={20} className="mr-2 text-muted-foreground" />
                                  <span>UPI: {upiForm.upiId || "UPI Payment"}</span>
                                </>
                              )}
                              
                              {paymentMethod === "netbanking" && (
                                <>
                                  <Wallet size={20} className="mr-2 text-muted-foreground" />
                                  <span>Net Banking</span>
                                </>
                              )}
                              
                              {paymentMethod === "cod" && (
                                <>
                                  <CreditCard size={20} className="mr-2 text-muted-foreground" />
                                  <span>Cash on Delivery</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-between">
                    {currentStep > 1 && (
                      <button
                        onClick={handleBack}
                        className="btn-secondary"
                      >
                        Back
                      </button>
                    )}
                    
                    {currentStep < 4 ? (
                      <button
                        onClick={handleContinue}
                        className="btn-primary ml-auto flex items-center gap-2"
                      >
                        Continue <ChevronsRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitOrder}
                        disabled={orderProcessing}
                        className={`btn-primary ml-auto flex items-center gap-2 ${
                          orderProcessing ? "opacity-70 cursor-wait" : ""
                        }`}
                      >
                        {orderProcessing ? "Processing..." : "Place Order"}
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
              
              {/* Order Summary */}
              <motion.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
                className="w-full lg:w-1/3"
              >
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          "Free"
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    
                    <div className="border-t border-border pt-4 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  
                  {/* Order Protection */}
                  <div className="p-4 bg-muted/30 rounded-lg mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lock size={24} className="text-primary" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">Secure Checkout</h3>
                        <p className="text-sm text-muted-foreground">
                          Your payment information is protected with industry-standard encryption.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Satisfaction Guarantee */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>We offer a 100% satisfaction guarantee. If you're not completely satisfied with your purchase, let us know and we'll make it right.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default Checkout;
