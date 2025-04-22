
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { trackEvent } from '../services/monitoring';

// Define the CartItem type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
}

// Define the Cart Context type
export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
  // Add aliases for compatibility with existing components
  cart: {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
  };
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or empty array
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedItems = localStorage.getItem('cart');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Calculate totals
  const total = items.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0
  );
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    toast.success(`${item.name} added to cart`);
    trackEvent('Cart', 'Add Item', item.name);
  };

  // Add product to cart with quantity
  const addToCart = (product: any, quantity: number) => {
    // Convert product to CartItem
    const cartItem: CartItem = {
      id: product.id.toString(), // Convert to string for consistency
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image,
      quantity: 1
    };

    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === cartItem.id);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(i => 
          i.id === cartItem.id 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        );
      } else {
        // Add new item with the specified quantity
        return [...prevItems, { ...cartItem, quantity }];
      }
    });
    
    toast.success(`${product.name} added to cart`);
    trackEvent('Cart', 'Add Item', product.name);
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.info("Item removed from cart");
    trackEvent('Cart', 'Remove Item', id);
  };

  // Alias for removeItem to maintain compatibility
  const removeFromCart = removeItem;

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
    trackEvent('Cart', 'Update Quantity', id, quantity);
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    trackEvent('Cart', 'Clear Cart');
  };

  // Create cart object for compatibility with existing components
  const cart = {
    items,
    totalItems,
    totalPrice: total
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity,
      clearCart,
      total,
      totalItems,
      // Aliases for compatibility
      cart,
      addToCart,
      removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
