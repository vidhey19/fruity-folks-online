
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { 
  loginWithEmail, 
  loginWithGoogle, 
  logout as firebaseLogout, 
  registerWithEmail,
  onAuthStateChange,
  checkUserIsAdmin,
  getUserData
} from "../firebase/auth";

interface UserData {
  id: string;
  name?: string;
  email?: string;
  isAdmin: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Effect for setting up auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Check if user is admin
        const admin = await checkUserIsAdmin(authUser);
        setIsAdmin(admin);
        
        // Get user data
        const data = await getUserData(authUser);
        if (data) {
          setUserData(data as UserData);
        }
      } else {
        setIsAdmin(false);
        setUserData(null);
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const clearLoginError = () => {
    setLoginError(null);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    clearLoginError();
    
    try {
      await loginWithEmail(email, password);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to login";
      setLoginError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    setIsLoading(true);
    clearLoginError();
    
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google successfully!");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to login with Google";
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
      const user = await loginWithEmail(email, password);
      
      // Check if user is admin
      const isUserAdmin = await checkUserIsAdmin(user);
      
      if (!isUserAdmin) {
        await firebaseLogout();
        setLoginError("You don't have admin privileges");
        toast.error("You don't have admin privileges");
        throw new Error("User is not an admin");
      }
      
      toast.success("Admin login successful!");
    } catch (error: any) {
      const errorMessage = error.message || "Admin login failed";
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
      await registerWithEmail(email, password, name);
      toast.success("Account created successfully!");
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed";
      setLoginError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        login,
        loginWithGoogle: googleLogin,
        adminLogin,
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
