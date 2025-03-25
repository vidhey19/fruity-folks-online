
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Product } from "../data/products";
import { toast } from "sonner";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction = 
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR_CART" };

interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  saveOrder: (customerInfo: CustomerInfo) => Promise<string>;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: string;
}

interface Order {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  return items.reduce(
    (totals, item) => {
      const itemPrice = item.salePrice || item.price;
      return {
        totalItems: totals.totalItems + item.quantity,
        totalPrice: totals.totalPrice + itemPrice * item.quantity
      };
    },
    { totalItems: 0, totalPrice: 0 }
  );
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        updatedItems = [...state.items, { ...product, quantity }];
      }

      const { totalItems, totalPrice } = calculateCartTotals(updatedItems);
      return { items: updatedItems, totalItems, totalPrice };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(item => item.id !== action.payload.productId);
      const { totalItems, totalPrice } = calculateCartTotals(updatedItems);
      return { items: updatedItems, totalItems, totalPrice };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      const updatedItems = state.items.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
      const { totalItems, totalPrice } = calculateCartTotals(updatedItems);
      return { items: updatedItems, totalItems, totalPrice };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load cart from localStorage
  const [savedCart] = React.useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : initialState;
    }
    return initialState;
  });

  const [cart, dispatch] = useReducer(cartReducer, savedCart);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (quantity <= 0) return;

    dispatch({
      type: "ADD_ITEM",
      payload: { product, quantity }
    });
    
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: number) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { productId }
    });
    
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.success("Cart cleared");
  };

  // Function to save an order
  const saveOrder = async (customerInfo: CustomerInfo): Promise<string> => {
    // Generate order ID
    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
    
    // Create new order object
    const newOrder: Order = {
      id: orderId,
      items: [...cart.items],
      customerInfo,
      total: cart.totalPrice,
      status: "Processing",
      date: new Date().toISOString().split('T')[0]
    };
    
    // Save order to localStorage (simulating database storage)
    const existingOrders = localStorage.getItem('orders') 
      ? JSON.parse(localStorage.getItem('orders') as string) 
      : [];
    
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Export to Google Sheets if integration is enabled
    const googleApiKey = localStorage.getItem('googleApiKey');
    const googleSheetId = localStorage.getItem('googleSheetId');
    
    if (googleApiKey && googleSheetId) {
      // Here we would normally make an API call to Google Sheets
      // For the demo, we'll just simulate success
      console.log("Order exported to Google Sheets:", newOrder);
    }
    
    // Clear the cart after successful order
    clearCart();
    
    // Return the order ID for confirmation
    return orderId;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
