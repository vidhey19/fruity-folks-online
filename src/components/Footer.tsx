
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/animations";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/40 pt-16 pb-8">
      <motion.div 
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div variants={fadeIn("up")} className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-display font-bold text-primary">Mango</span>
              <span className="text-2xl font-display font-bold text-leaf-600">Marvel</span>
            </div>
            <p className="text-muted-foreground">
              Delivering the finest quality mangoes and fresh produce directly to your doorstep. 
              Experience nature's sweetness with every bite.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeIn("up", 0.1)} className="space-y-4">
            <h4 className="font-display text-lg font-bold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/shop?category=mangoes" className="text-muted-foreground hover:text-primary transition-colors">
                  Mangoes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=fruits" className="text-muted-foreground hover:text-primary transition-colors">
                  Other Fruits
                </Link>
              </li>
              <li>
                <Link to="/shop?category=vegetables" className="text-muted-foreground hover:text-primary transition-colors">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Customer Support */}
          <motion.div variants={fadeIn("up", 0.2)} className="space-y-4">
            <h4 className="font-display text-lg font-bold">Customer Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={fadeIn("up", 0.3)} className="space-y-4">
            <h4 className="font-display text-lg font-bold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-primary" />
                <span className="text-muted-foreground">
                  123 Orchard Way, Fruitville, CA 90210
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span className="text-muted-foreground">hello@mangomarvel.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div 
          variants={fadeIn("up", 0.4)}
          className="mt-16 p-6 bg-white rounded-xl shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display text-lg font-bold">Subscribe to Our Newsletter</h4>
              <p className="text-muted-foreground">Stay updated with our latest offers and seasonal picks</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mango Marvel. All rights reserved.</p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
