
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Product } from "../data/products";
import { toast } from "sonner";

interface WishlistState {
  items: Product[];
}

type WishlistAction = 
  | { type: "ADD_ITEM"; payload: { product: Product } }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "CLEAR_WISHLIST" };

interface WishlistContextType {
  wishlist: WishlistState;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
}

const initialState: WishlistState = {
  items: []
};

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        return state; // Item already exists, no change
      }

      return { items: [...state.items, product] };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(item => item.id !== action.payload.productId);
      return { items: updatedItems };
    }

    case "CLEAR_WISHLIST":
      return initialState;

    default:
      return state;
  }
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load wishlist from localStorage
  const [savedWishlist] = React.useState(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : initialState;
    }
    return initialState;
  });

  const [wishlist, dispatch] = useReducer(wishlistReducer, savedWishlist);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { product }
    });
    
    toast.success(`${product.name} added to wishlist`);
  };

  const removeFromWishlist = (productId: number) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { productId }
    });
    
    toast.success("Item removed from wishlist");
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
    toast.success("Wishlist cleared");
  };

  const isInWishlist = (productId: number) => {
    return wishlist.items.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
