
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import AnimatedPage from "../components/AnimatedPage";
import CurrencySelector from "../components/CurrencySelector";
import { products, getRelatedProducts, Product } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { fadeIn, staggerContainer } from "../utils/animations";
import {
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  Heart,
  Check,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  
  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
    
    if (id) {
      const productId = parseInt(id);
      const foundProduct = products.find(p => p.id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.image);
        setRelatedProducts(getRelatedProducts(productId));
      }
    }
  }, [id]);
  
  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-8">Sorry, the product you're looking for doesn't exist.</p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    if (!isWishlisted) {
      toast.success("Added to wishlist");
    } else {
      toast.success("Removed from wishlist");
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Share API
      toast.success("Link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };
  
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;
  
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
                <Link to="/shop" className="text-muted-foreground hover:text-foreground">
                  Shop
                </Link>
                <span className="mx-2 text-muted-foreground">/</span>
                <span className="font-medium">{product.name}</span>
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
          
          {/* Product Details */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Product Images */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full md:w-1/2"
                >
                  {/* Main Image */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                </motion.div>
                
                {/* Product Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full md:w-1/2"
                >
                  {/* Category */}
                  <div className="mb-2">
                    <span className="text-sm font-medium text-muted-foreground capitalize">
                      {product.category}
                    </span>
                  </div>
                  
                  {/* Name */}
                  <h1 className="text-3xl font-display font-bold mb-4">{product.name}</h1>
                  
                  {/* Price and Currency Selector */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.salePrice || product.price)}
                      </span>
                      {product.salePrice && (
                        <span className="text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      {discount && (
                        <span className="bg-primary/10 text-primary text-sm font-medium px-2 py-1 rounded-full">
                          {discount}% Off
                        </span>
                      )}
                    </div>
                    <CurrencySelector />
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
                  {/* Product Meta */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Origin</h4>
                      <p>{product.origin}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Weight</h4>
                      <p>{product.weight}</p>
                    </div>
                  </div>
                  
                  {/* Stock Status */}
                  <div className="flex items-center mb-6">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span>
                      {product.stock > 10
                        ? 'In Stock'
                        : product.stock > 0
                          ? `Only ${product.stock} left`
                          : 'Out of Stock'}
                    </span>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center mb-6">
                    <span className="mr-4">Quantity:</span>
                    <div className="flex items-center border border-border rounded-full">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className={`w-10 h-10 flex items-center justify-center rounded-l-full ${
                          quantity <= 1 ? 'text-muted-foreground' : 'hover:bg-muted'
                        }`}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        min="1"
                        max={product.stock}
                        className="w-12 text-center border-none focus:outline-none focus:ring-0 bg-transparent"
                        aria-label="Quantity"
                      />
                      <button
                        onClick={increaseQuantity}
                        disabled={quantity >= product.stock}
                        className={`w-10 h-10 flex items-center justify-center rounded-r-full ${
                          quantity >= product.stock ? 'text-muted-foreground' : 'hover:bg-muted'
                        }`}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
                        product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={toggleWishlist}
                      className={`btn-secondary flex items-center justify-center gap-2 ${
                        isWishlisted ? 'bg-red-50 text-red-500 hover:bg-red-100 ring-red-200' : ''
                      }`}
                    >
                      <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                      {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="btn-icon"
                      aria-label="Share product"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/shop?tag=${tag}`}
                        className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground hover:bg-muted/80"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Benefits */}
                  <div className="bg-muted/30 rounded-xl p-4">
                    <h3 className="font-medium mb-3">Why Choose Our Products</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-leaf-500/20 flex items-center justify-center mr-2">
                          <Check size={12} className="text-leaf-600" />
                        </div>
                        <span className="text-sm">100% Fresh and Natural</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-leaf-500/20 flex items-center justify-center mr-2">
                          <Check size={12} className="text-leaf-600" />
                        </div>
                        <span className="text-sm">Carefully Selected and Sourced</span>
                      </li>
                      <li className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-leaf-500/20 flex items-center justify-center mr-2">
                          <Check size={12} className="text-leaf-600" />
                        </div>
                        <span className="text-sm">Fast Delivery to Maintain Freshness</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-display font-bold mb-8">You May Also Like</h2>
                
                <motion.div
                  variants={staggerContainer()}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {relatedProducts.map((product, index) => (
                    <motion.div key={product.id} variants={fadeIn("up", index * 0.1)}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          )}
        </main>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
