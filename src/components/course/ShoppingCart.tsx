
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart as CartIcon } from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  instructor: string;
  price: number;
  image: string;
  quantity: number;
}

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CartIcon className="h-5 w-5" />
            Shopping Cart (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <CartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add some courses to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingCart;
