
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedPage from "../components/AnimatedPage";
import { Check, ArrowLeft, ShoppingBag } from "lucide-react";

const OrderSuccess = () => {
  // Generate a random order ID for demo purposes
  const orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <AnimatedPage>
        <main className="py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
              
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase from Amrit Naturals. We've received your order and
                are preparing it for shipment.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-6 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-8">
                A confirmation email has been sent to your registered email address. You can also
                track your order status in the 'My Orders' section.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="btn-secondary flex items-center justify-center gap-2">
                  <ArrowLeft size={16} />
                  Back to Home
                </Link>
                
                <Link to="/shop" className="btn-primary flex items-center justify-center gap-2">
                  <ShoppingBag size={16} />
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default OrderSuccess;
