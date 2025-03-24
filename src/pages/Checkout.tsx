
import { useState } from "react";
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
  ShoppingBag
} from "lucide-react";

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
    country: "United States",
    phone: ""
  });
  
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  
  const subtotal = cart.totalPrice;
  const shipping = deliveryMethod === "express" ? 14.99 : deliveryMethod === "standard" ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  const handleShippingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCardFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardForm(prev => ({ ...prev, [name]: value }));
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
    // Validate payment details if using card
    if (paymentMethod === "card") {
      const { cardNumber, cardName, expiryDate, cvv } = cardForm;
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error("Please fill in all card details");
        return;
      }
    }
    
    setOrderProcessing(true);
    
    // Simulate order processing
    try {
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
                            State/Province *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={shippingForm.state}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                            ZIP/Postal Code *
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={shippingForm.postalCode}
                            onChange={handleShippingFormChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
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
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
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
                                <span className="font-medium">{formatPrice(5.99)}</span>
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
                                <span className="font-medium">{formatPrice(14.99)}</span>
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
                              </div>
                              <CreditCard size={20} className="text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div
                            className={`border ${
                              paymentMethod === "paypal" ? "border-primary" : "border-border"
                            } rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors`}
                            onClick={() => setPaymentMethod("paypal")}
                          >
                            <div className="flex items-center">
                              <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                                paymentMethod === "paypal" ? "border-primary bg-primary/10" : "border-muted-foreground"
                              }`}>
                                {paymentMethod === "paypal" && <Check size={12} className="text-primary" />}
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">PayPal</h3>
                              </div>
                              <Wallet size={20} className="text-muted-foreground" />
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
                        
                        {/* PayPal Info */}
                        {paymentMethod === "paypal" && (
                          <div className="mt-6 border-t border-border pt-6">
                            <p className="text-muted-foreground">
                              You will be redirected to PayPal to complete your payment securely.
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
                                    {formatPrice((item.salePrice || item.price) * item.quantity)}
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
                              
                              {paymentMethod === "paypal" && (
                                <>
                                  <Wallet size={20} className="mr-2 text-muted-foreground" />
                                  <span>PayPal</span>
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
                      <span className="text-muted-foreground">Tax (7%)</span>
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
