
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import AnimatedPage from "../components/AnimatedPage";
import { getProductsByCategory, categories, products, Product, searchProducts } from "../data/products";
import { staggerContainer, fadeIn } from "../utils/animations";
import { Filter, Search, X, ChevronDown } from "lucide-react";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 1000]); // Set a reasonable default max
  
  // Filter products when category or search changes
  useEffect(() => {
    let filtered = getProductsByCategory(selectedCategory);
    
    // Apply search filter if query exists
    if (localSearchQuery) {
      filtered = searchProducts(localSearchQuery).filter(
        product => selectedCategory === "all" || product.category === selectedCategory
      );
    }
    
    // Apply price filter
    filtered = filtered.filter(
      product => {
        const price = product.salePrice || product.price;
        return price >= priceRange[0] && price <= priceRange[1];
      }
    );
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "newest":
        // In a real app, you would sort by date added
        filtered.sort((a, b) => b.id - a.id);
        break;
      default: // "featured"
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    setFilteredProducts(filtered);
    
    // Update URL params
    const params: { [key: string]: string } = {};
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (localSearchQuery) params.search = localSearchQuery;
    setSearchParams(params);
  }, [selectedCategory, localSearchQuery, sortBy, priceRange, setSearchParams]);
  
  // Initialize with maximum price range 
  useEffect(() => {
    // Set initial price range to include all products
    const maxPrice = Math.max(...products.map(p => p.price)) + 5;
    setPriceRange([0, maxPrice]);
    
    // If there's a search query from URL, update the local state
    if (searchQuery) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);
  
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowFilter(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get("search") as string;
    setLocalSearchQuery(query);
  };
  
  const clearSearch = () => {
    setLocalSearchQuery("");
  };
  
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  
  // Get the highest product price for the range input
  const maxPrice = Math.max(...products.map(p => p.price)) + 5;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AnimatedPage>
        <main className="flex-grow">
          {/* Page Header */}
          <div className="bg-primary/10 py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-display font-bold mb-4">Shop</h1>
              <p className="text-muted-foreground max-w-xl">
                Browse our selection of fresh fruits and vegetables. From juicy mangoes to crisp apples, we have everything you need.
              </p>
            </div>
          </div>
          
          {/* Shop Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Desktop Filter */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full lg:w-64 hidden lg:block"
              >
                <div className="sticky top-24">
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="font-display font-bold mb-4">Categories</h3>
                    <ul className="space-y-2">
                      {categories.map(category => (
                        <li key={category.id}>
                          <button
                            onClick={() => handleCategoryChange(category.id)}
                            className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                              selectedCategory === category.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted"
                            }`}
                          >
                            {category.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="font-display font-bold mb-4">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Main Content */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-grow"
              >
                {/* Search and Sort */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <form onSubmit={handleSearch} className="relative flex-grow">
                    <input
                      type="text"
                      name="search"
                      placeholder="Search products..."
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pr-10 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {localSearchQuery ? (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X size={16} />
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <Search size={16} />
                    </button>
                  </form>
                  
                  <div className="flex gap-2">
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none px-4 py-2 pr-10 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />
                    </div>
                    
                    <button
                      onClick={toggleFilter}
                      className="lg:hidden px-4 py-2 rounded-full border border-border bg-white"
                    >
                      <Filter size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Mobile Filter Drawer */}
                <AnimatePresence>
                  {showFilter && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="lg:hidden bg-white rounded-xl shadow-sm p-6 mb-6 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-display font-bold">Filters</h3>
                        <button onClick={toggleFilter}>
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {categories.map(category => (
                            <button
                              key={category.id}
                              onClick={() => handleCategoryChange(category.id)}
                              className={`py-1 px-3 rounded-full text-sm ${
                                selectedCategory === category.id
                                  ? "bg-primary text-white"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Price Range</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
                
                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <motion.div
                    variants={staggerContainer()}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div key={product.id} variants={fadeIn("up", index * 0.05)}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      We couldn't find any products matching your criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setLocalSearchQuery("");
                        setPriceRange([0, maxPrice]);
                      }}
                      className="btn-primary"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default Shop;
