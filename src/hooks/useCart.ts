
import { useState } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev; // Item already in cart
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice
  };
};
