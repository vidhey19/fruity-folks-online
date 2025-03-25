
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { LockIcon, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedPage from "../components/AnimatedPage";
import { Button } from "@/components/ui/button";

const AdminAuth = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { adminLogin, loginError, clearLoginError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await adminLogin(email, password);
      navigate("/admin");
    } catch (error) {
      console.error("Admin login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AnimatedPage>
        <div className="flex flex-grow items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-md rounded-lg p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4"
                >
                  <LockIcon size={28} />
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-gray-900">Admin Panel Login</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please sign in with your administrator credentials
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {loginError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
                    {loginError}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearLoginError();
                      }}
                      required
                      className="appearance-none block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary/50 focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearLoginError();
                      }}
                      required
                      className="appearance-none block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary/50 focus:border-primary sm:text-sm"
                      placeholder="Use: admin123"
                    />
                  </div>
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign in as Administrator"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default AdminAuth;
