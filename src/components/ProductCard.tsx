
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, updateQuantity } = useCart();
  
  // Check if product is in cart and get quantity
  const productInCart = cart.items.find(item => item.id === product.id);
  const quantityInCart = productInCart ? productInCart.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (productInCart) {
      updateQuantity(product.id, productInCart.quantity + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (productInCart && productInCart.quantity > 0) {
      updateQuantity(product.id, productInCart.quantity - 1);
    }
  };

  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative"
      >
        {/* Discount badge */}
        {product.salePrice && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="destructive" className="font-semibold">
              {discountPercentage}% OFF
            </Badge>
          </div>
        )}
        
        {/* Cart quantity badge */}
        {quantityInCart > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="font-semibold bg-primary text-white">
              {quantityInCart} in cart
            </Badge>
          </div>
        )}
        
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Quantity controls */}
          <div className="absolute bottom-3 right-3 flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            {quantityInCart > 0 ? (
              <>
                <button
                  onClick={handleDecreaseQuantity}
                  className="h-8 w-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-l-full"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{quantityInCart}</span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="h-8 w-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-r-full"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={handleAddToCart}
                className="h-8 flex items-center justify-center px-3 text-primary hover:bg-primary/10 rounded-full"
                aria-label="Add to cart"
              >
                <ShoppingBag size={16} className="mr-1" />
                <span className="text-xs font-medium">Add</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-medium line-clamp-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.weight}</p>
          </div>
          
          <div className="mt-3 flex items-center">
            {product.salePrice ? (
              <>
                <span className="font-semibold text-primary">₹{product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-primary">₹{product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
