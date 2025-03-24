
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { cardHoverVariants } from "../utils/animations";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <motion.div
      className="group h-full"
      whileHover="hover"
      variants={cardHoverVariants}
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="h-full bg-white rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
          {/* Image container with aspect ratio */}
          <div className="relative overflow-hidden h-64">
            <div className={`absolute inset-0 bg-gray-100 ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              {/* Placeholder shimmer effect */}
              <div className="animate-pulse h-full w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]" style={{ backgroundPositionX: '100%', animation: 'shimmer 1.5s infinite' }}></div>
            </div>
            
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
            />
            
            {/* Tags and badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.salePrice && (
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                  Sale
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-leaf-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Best Seller
                </span>
              )}
            </div>
            
            {/* Action buttons (wishlist, add to cart) */}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <button
                onClick={toggleWishlist}
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                  isWishlisted 
                    ? 'bg-red-50 text-red-500' 
                    : 'bg-white text-gray-400 hover:text-red-500'
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          
          {/* Product info */}
          <div className="p-4">
            <h3 className="font-medium text-base mb-1">{product.name}</h3>
            
            <div className="flex items-center gap-2 mb-3">
              {product.salePrice ? (
                <>
                  <span className="font-bold text-primary">{formatPrice(product.salePrice)}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-bold text-primary">{formatPrice(product.price)}</span>
              )}
            </div>
            
            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-white border border-border rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
