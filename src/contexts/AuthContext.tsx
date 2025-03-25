
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  provider?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginError: string | null;
  clearLoginError: () => void;
}

// Admin credentials - in a real app, these would be stored securely in a database
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage (simulating persistence)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const clearLoginError = () => {
    setLoginError(null);
  };

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    setIsLoading(true);
    clearLoginError();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email || !password) {
        setLoginError("Email and password are required");
        throw new Error("Email and password are required");
      }
      
      if (password.length < 6) {
        setLoginError("Password must be at least 6 characters");
        throw new Error("Password must be at least 6 characters");
      }
      
      // For demo purposes, you might want to add a specific check to simulate incorrect credentials
      if (email === "wrong@example.com" || password === "wrongpass") {
        setLoginError("Invalid email or password");
        throw new Error("Invalid email or password");
      }
      
      // Create a mock user
      const mockUser = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        provider: "email"
      };
      
      // Store user in localStorage (for persistence)
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success("Logged in successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to login";
      setLoginError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    clearLoginError();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email || !password) {
        setLoginError("Email and password are required");
        throw new Error("Email and password are required");
      }
      
      // Check against predefined admin credentials
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        setLoginError("Invalid admin credentials");
        throw new Error("Invalid admin credentials");
      }
      
      // Create admin user
      const adminUser = {
        id: `admin-${Date.now()}`,
        email: ADMIN_EMAIL,
        name: "Administrator",
        provider: "email",
        isAdmin: true
      };
      
      // Store admin user in localStorage
      localStorage.setItem("user", JSON.stringify(adminUser));
      setUser(adminUser);
      toast.success("Admin login successful!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Admin login failed";
      setLoginError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    clearLoginError();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate Google authentication
      const mockGoogleUser = {
        id: `google-user-${Date.now()}`,
        email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
        name: `Google User ${Math.floor(Math.random() * 1000)}`,
        provider: "google"
      };
      
      localStorage.setItem("user", JSON.stringify(mockGoogleUser));
      setUser(mockGoogleUser);
      toast.success("Logged in with Google successfully!");
    } catch (error) {
      const errorMessage = "Failed to log in with Google. Please try again.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    clearLoginError();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration validation
      if (!name || !email || !password) {
        setLoginError("All fields are required");
        throw new Error("All fields are required");
      }
      
      if (password.length < 6) {
        setLoginError("Password must be at least 6 characters");
        throw new Error("Password must be at least 6 characters");
      }
      
      // Simulate email already in use
      if (email === "taken@example.com") {
        setLoginError("Email is already in use");
        throw new Error("Email is already in use");
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        provider: "email"
      };
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      toast.success("Account created successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      setLoginError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        isLoading,
        login,
        adminLogin,
        loginWithGoogle,
        register,
        logout,
        loginError,
        clearLoginError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
