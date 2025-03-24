
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../contexts/AuthContext";
import { slideIn } from "../utils/animations";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(redirect === "checkout" ? "/checkout" : `/${redirect}`);
    }
  }, [isAuthenticated, isLoading, navigate, redirect]);
  
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      // Form validation
      if (!loginForm.email || !loginForm.password) {
        toast.error("Please fill in all fields");
        return;
      }
      
      await login(loginForm.email, loginForm.password);
      
      // If login successful, navigate is handled by the useEffect above
    } catch (error) {
      console.error("Login error:", error);
      // Error handling is done in the AuthContext
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      // Form validation
      if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      
      if (registerForm.password !== registerForm.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      await register(registerForm.name, registerForm.email, registerForm.password);
      
      // If registration successful, navigate is handled by the useEffect above
    } catch (error) {
      console.error("Registration error:", error);
      // Error handling is done in the AuthContext
    } finally {
      setFormLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <AnimatedPage>
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setIsLoginMode(true)}
                    className={`flex-1 py-4 text-center font-medium transition-colors ${
                      isLoginMode
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLoginMode(false)}
                    className={`flex-1 py-4 text-center font-medium transition-colors ${
                      !isLoginMode
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
                
                <div className="p-6">
                  {/* Login Form */}
                  {isLoginMode && (
                    <motion.div
                      variants={slideIn("right", "tween", 0, 0.3)}
                      initial="hidden"
                      animate="show"
                    >
                      <h2 className="text-2xl font-display font-bold mb-6">Welcome Back</h2>
                      
                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="login-email" className="block text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="login-email"
                            name="email"
                            value={loginForm.email}
                            onChange={handleLoginChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="login-password" className="block text-sm font-medium mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="login-password"
                              name="password"
                              value={loginForm.password}
                              onChange={handleLoginChange}
                              className="w-full rounded-lg border border-border px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                              required
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="remember-me"
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                              Remember me
                            </label>
                          </div>
                          
                          <a href="#" className="text-sm text-primary hover:text-primary/80">
                            Forgot password?
                          </a>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={formLoading}
                          className="btn-primary w-full flex items-center justify-center"
                        >
                          {formLoading ? (
                            <>
                              <Loader2 size={18} className="mr-2 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </button>
                      </form>
                      
                      <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          Don't have an account?{" "}
                          <button
                            type="button"
                            onClick={toggleMode}
                            className="text-primary hover:text-primary/80 font-medium"
                          >
                            Create one
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Register Form */}
                  {!isLoginMode && (
                    <motion.div
                      variants={slideIn("left", "tween", 0, 0.3)}
                      initial="hidden"
                      animate="show"
                    >
                      <h2 className="text-2xl font-display font-bold mb-6">Create an Account</h2>
                      
                      <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="register-name" className="block text-sm font-medium mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="register-name"
                            name="name"
                            value={registerForm.name}
                            onChange={handleRegisterChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="register-email" className="block text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="register-email"
                            name="email"
                            value={registerForm.email}
                            onChange={handleRegisterChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="register-password" className="block text-sm font-medium mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="register-password"
                              name="password"
                              value={registerForm.password}
                              onChange={handleRegisterChange}
                              className="w-full rounded-lg border border-border px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                              required
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Password must be at least 6 characters long
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="register-confirm-password" className="block text-sm font-medium mb-2">
                            Confirm Password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="register-confirm-password"
                            name="confirmPassword"
                            value={registerForm.confirmPassword}
                            onChange={handleRegisterChange}
                            className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="terms"
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                            required
                          />
                          <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                            I agree to the{" "}
                            <a href="#" className="text-primary hover:text-primary/80">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-primary hover:text-primary/80">
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={formLoading}
                          className="btn-primary w-full flex items-center justify-center"
                        >
                          {formLoading ? (
                            <>
                              <Loader2 size={18} className="mr-2 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </button>
                      </form>
                      
                      <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={toggleMode}
                            className="text-primary hover:text-primary/80 font-medium"
                          >
                            Sign in
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default Auth;
