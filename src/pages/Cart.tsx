
import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import AnimatedPage from "../components/AnimatedPage";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { fadeIn, staggerContainer } from "../utils/animations";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

const Cart = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple promo code logic - in a real app this would verify with backend
    if (promoCode.toLowerCase() === "mango10") {
      setIsPromoApplied(true);
      setPromoDiscount(cart.totalPrice * 0.1); // 10% discount
    } else {
      setIsPromoApplied(false);
      setPromoDiscount(0);
    }
  };
  
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping - promoDiscount;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <AnimatedPage>
        <main className="py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>
            
            {cart.items.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <motion.div
                  variants={staggerContainer()}
                  initial="hidden"
                  animate="show"
                  className="w-full lg:w-2/3"
                >
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-medium">
                        Your Items ({cart.totalItems})
                      </h2>
                      <button
                        onClick={clearCart}
                        className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-sm"
                      >
                        <Trash2 size={16} />
                        Clear Cart
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {cart.items.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
                
                {/* Cart Summary */}
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
                      
                      {isPromoApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Promo Discount</span>
                          <span>-{formatPrice(promoDiscount)}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-border pt-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                    
                    {/* Promo Code */}
                    <form onSubmit={handleApplyPromo} className="mb-6">
                      <label htmlFor="promo" className="block text-sm font-medium mb-2">
                        Promo Code
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="promo"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter promo code"
                          className="flex-1 rounded-l-lg border border-r-0 border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="submit"
                          className="bg-primary text-white px-4 py-2 rounded-r-lg font-medium hover:bg-primary/90"
                        >
                          Apply
                        </button>
                      </div>
                      {isPromoApplied && (
                        <p className="text-sm text-green-600 mt-1">
                          Promo code applied successfully!
                        </p>
                      )}
                    </form>
                    
                    {/* Checkout Button */}
                    <Link
                      to={isAuthenticated ? "/checkout" : "/auth?redirect=checkout"}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {isAuthenticated ? (
                        <>
                          Proceed to Checkout <ArrowRight size={16} />
                        </>
                      ) : (
                        <>
                          Sign In to Checkout <ArrowRight size={16} />
                        </>
                      )}
                    </Link>
                    
                    {/* Continue Shopping */}
                    <Link
                      to="/shop"
                      className="block text-center mt-4 text-primary font-medium"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                  <ShoppingCart size={32} className="text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Looks like you haven't added any products to your cart yet. Browse our collection and discover premium fruits and vegetables.
                </p>
                <Link to="/shop" className="btn-primary">
                  Start Shopping
                </Link>
              </motion.div>
            )}
          </div>
        </main>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default Cart;
