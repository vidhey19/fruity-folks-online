
import React from "react";
import { useCart } from "../contexts/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    quantity: number;
    weight?: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };
  
  const increaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const itemPrice = item.salePrice || item.price;
  const totalPrice = itemPrice * item.quantity;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-border gap-4"
    >
      {/* Product image */}
      <div className="w-20 h-20 bg-white rounded-md overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product info */}
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-muted-foreground">{item.weight}</p>
        <div className="flex items-center mt-1">
          <span className="font-medium text-primary">
            ₹{itemPrice.toFixed(2)}
          </span>
          {item.salePrice && (
            <span className="ml-2 text-sm text-muted-foreground line-through">
              ₹{item.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      
      {/* Quantity controls */}
      <div className="flex items-center border border-border rounded-full">
        <button 
          onClick={decreaseQuantity}
          className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-l-full"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
          min="1"
          className="w-10 text-center border-none focus:outline-none focus:ring-0 bg-transparent"
          aria-label="Quantity"
        />
        <button 
          onClick={increaseQuantity}
          className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-r-full"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {/* Price */}
      <div className="text-right min-w-[80px]">
        <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
      </div>
      
      {/* Remove button */}
      <button 
        onClick={handleRemove}
        className="text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
};

export default CartItem;
