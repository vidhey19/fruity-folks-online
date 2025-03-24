
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { 
  getFeaturedProducts, 
  getBestSellerProducts, 
  categories 
} from "../data/products";
import { 
  fadeIn, 
  staggerContainer, 
  slideIn 
} from "../utils/animations";
import { 
  ShoppingBag, 
  Truck, 
  Leaf, 
  Award,
  ArrowRight,
  ChevronRight
} from "lucide-react";

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  const bestSellerProducts = getBestSellerProducts();
  
  // Parallax scrolling effect
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div ref={targetRef} className="relative h-[90vh] flex items-center overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1623930188143-092a288a8fb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Fresh mangoes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-xl text-white"
          >
            <span className="inline-block px-3 py-1 bg-primary/90 text-white text-sm font-medium rounded-full mb-4">
              Premium Quality
            </span>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              The Finest Mangoes Delivered to Your Door
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Experience the exquisite taste of hand-picked, premium mangoes from the finest orchards around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-primary">
                Shop Now
              </Link>
              <Link to="/about" className="btn-secondary bg-white/20 hover:bg-white/30 text-white ring-0">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Features Section */}
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={fadeIn("up")} className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">100% Fresh</h3>
              <p className="text-muted-foreground">
                Our fruits are harvested at peak ripeness and delivered directly to your doorstep.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn("up", 0.1)} className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">
                Enjoy free shipping on all orders over $50. Your satisfaction is our priority.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn("up", 0.2)} className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">
                Shop with confidence using our secure payment options and checkout process.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn("up", 0.3)} className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                We source only the highest quality fruits from trusted farmers and suppliers.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our selection of fresh fruits and vegetables sourced from the best farms around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.filter(cat => cat.id !== "all").map((category, index) => (
              <motion.div
                key={category.id}
                variants={fadeIn("up", index * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className="relative h-64 rounded-xl overflow-hidden group cursor-pointer hover-scale"
              >
                <img
                  src={`https://source.unsplash.com/random/600x400/?${category.id}`}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-display font-bold text-white mb-2">{category.name}</h3>
                  <Link 
                    to={`/shop?category=${category.id}`}
                    className="inline-flex items-center text-white/90 hover:text-white"
                  >
                    Shop Now <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Best Sellers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Best Sellers</h2>
              <p className="text-muted-foreground">
                Our most popular products that customers love
              </p>
            </div>
            <Link 
              to="/shop" 
              className="inline-flex items-center font-medium text-primary hover:text-primary/80 mt-4 md:mt-0"
            >
              View All Products <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellerProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeIn("up", index * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Banner Section */}
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-20 bg-primary/10 relative overflow-hidden"
      >
        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="absolute right-0 bottom-0 w-1/2 h-full hidden md:block"
        >
          <img
            src="https://images.unsplash.com/photo-1519096845289-95806ee03a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Mango"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl">
            <motion.span variants={fadeIn("up")} className="inline-block px-3 py-1 bg-white text-primary text-sm font-medium rounded-full mb-4">
              Limited Time Offer
            </motion.span>
            <motion.h2 variants={fadeIn("up", 0.1)} className="text-4xl font-display font-bold mb-4">
              30% Off on Alphonso Mangoes
            </motion.h2>
            <motion.p variants={fadeIn("up", 0.2)} className="text-lg text-muted-foreground mb-8">
              Enjoy premium Alphonso mangoes at a special discount! Known for their rich flavor and smooth texture, these mangoes are perfect for summer desserts and smoothies.
            </motion.p>
            <motion.div variants={fadeIn("up", 0.3)}>
              <Link to="/shop" className="btn-primary">
                Shop Now
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Handpicked selection of our finest quality fruits
              </p>
            </div>
            <Link 
              to="/shop" 
              className="inline-flex items-center font-medium text-primary hover:text-primary/80 mt-4 md:mt-0"
            >
              View All Products <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeIn("up", index * 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-16 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 variants={fadeIn("up")} className="text-3xl font-display font-bold mb-4">
              What Our Customers Say
            </motion.h2>
            <motion.p variants={fadeIn("up", 0.1)} className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - here's what our customers have to say about their experience with Mango Marvel.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fadeIn("up", 0.2)} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="font-display font-bold text-primary">JD</span>
                </div>
                <div>
                  <h4 className="font-medium">John Doe</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The Alphonso mangoes were amazing! So juicy and flavorful. Will definitely be ordering more when they're in season again."
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn("up", 0.3)} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="font-display font-bold text-primary">JS</span>
                </div>
                <div>
                  <h4 className="font-medium">Jane Smith</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Fast delivery and excellent customer service. The variety of fruits is impressive and the quality is consistently good."
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn("up", 0.4)} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <span className="font-display font-bold text-primary">RJ</span>
                </div>
                <div>
                  <h4 className="font-medium">Robert Johnson</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "I ordered a mixed fruit box and everything was fresh and delicious. Great value for money. Will definitely order again."
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      <Footer />
    </div>
  );
};

export default Index;
