
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { navbarVariants } from "../utils/animations";
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search,
  LogOut,
  LogIn
} from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-display font-bold text-primary">Amrit</span>
            <span className="text-2xl font-display font-bold text-leaf-600">Naturals</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/shop" className="font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Actions (Cart, User, Search) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link to="/cart" className="p-2 rounded-full hover:bg-muted transition-colors relative">
              <ShoppingCart size={20} />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-muted transition-colors flex items-center">
                  <User size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/account" className="flex items-center p-2 hover:bg-muted rounded-md transition-colors text-sm">
                      My Account
                    </Link>
                    <Link to="/orders" className="flex items-center p-2 hover:bg-muted rounded-md transition-colors text-sm">
                      My Orders
                    </Link>
                    <button 
                      onClick={logout}
                      className="flex items-center p-2 hover:bg-muted rounded-md transition-colors text-sm w-full text-left text-destructive"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="p-2 rounded-full hover:bg-muted transition-colors">
                <LogIn size={20} />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="block md:hidden p-2 rounded-full hover:bg-muted transition-colors"
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Search Bar (conditionally rendered) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full bg-white shadow-sm"
            >
              <div className="container mx-auto px-4 py-3">
                <form className="flex items-center">
                  <Search size={20} className="mr-2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="w-full bg-transparent border-none outline-none focus:ring-0"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm pt-20"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col h-full">
              <div className="flex flex-col space-y-6 text-lg font-medium">
                <Link to="/" className="py-2 border-b border-gray-100 hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/shop" className="py-2 border-b border-gray-100 hover:text-primary transition-colors">
                  Shop
                </Link>
                <Link to="/about" className="py-2 border-b border-gray-100 hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/contact" className="py-2 border-b border-gray-100 hover:text-primary transition-colors">
                  Contact
                </Link>
              </div>

              <div className="mt-auto">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <Button variant="outline" onClick={logout} className="w-full">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link to="/auth">
                      <Button className="w-full">Sign In</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Space to push content below the navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
