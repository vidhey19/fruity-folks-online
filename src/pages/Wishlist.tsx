
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedPage from "../components/AnimatedPage";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { fadeIn, staggerContainer } from "../utils/animations";
import { Heart, ShoppingCart, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  
  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };
  
  const moveAllToCart = () => {
    wishlist.items.forEach(item => {
      addToCart(item, 1);
    });
    clearWishlist();
    toast.success("All items moved to cart");
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <AnimatedPage>
        <main>
          {/* Breadcrumbs */}
          <div className="bg-muted/30 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex items-center text-sm">
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <span className="mx-2 text-muted-foreground">/</span>
                <span className="font-medium">Wishlist</span>
              </nav>
            </div>
          </div>
          
          {/* Back to shop button (Mobile) */}
          <div className="container mx-auto px-4 py-4 md:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center text-sm font-medium hover:text-primary"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Shop
            </Link>
          </div>
          
          {/* Wishlist Content */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold">My Wishlist</h1>
                
                {wishlist.items.length > 0 && (
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={clearWishlist}
                      className="hidden sm:flex items-center gap-2"
                    >
                      <X size={16} />
                      Clear All
                    </Button>
                    
                    <Button
                      onClick={moveAllToCart}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Move All to Cart
                    </Button>
                  </div>
                )}
              </div>
              
              {wishlist.items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                    <Heart size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Add items to your wishlist to save them for later.
                  </p>
                  <Link to="/shop">
                    <Button>Continue Shopping</Button>
                  </Link>
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer()}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {wishlist.items.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={fadeIn("up", index * 0.1)}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <Link to={`/product/${product.id}`} className="block">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                      
                      <div className="p-4">
                        <div className="mb-1">
                          <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
                        </div>
                        
                        <Link to={`/product/${product.id}`} className="block">
                          <h3 className="font-medium text-lg mb-2 line-clamp-1">{product.name}</h3>
                        </Link>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {formatPrice(product.salePrice || product.price)}
                            </span>
                            
                            {product.salePrice && (
                              <span className="text-muted-foreground line-through text-sm">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                              aria-label="Remove from wishlist"
                            >
                              <Heart size={16} fill="currentColor" />
                            </button>
                            
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                              aria-label="Add to cart"
                            >
                              <ShoppingCart size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </section>
        </main>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
