
import { Link } from "react-router-dom";
import { Product } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "../hooks/use-mobile";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const isMobile = useIsMobile();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
  };
  
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast.success(`${product.name} added to wishlist`);
  };
  
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
        {/* Card Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover transition-transform group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestSeller && (
              <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Best Seller
              </span>
            )}
            
            {discount && (
              <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                {discount}% Off
              </span>
            )}
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-1">
            <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
          </div>
          
          <h3 className="font-medium text-lg mb-2 line-clamp-1">{product.name}</h3>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between">
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
              
              <div className={`${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity flex gap-1`}>
                <button
                  onClick={handleWishlist}
                  className="p-2 rounded-full bg-muted/50 hover:bg-muted"
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} />
                </button>
                
                <button
                  onClick={handleAddToCart}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
