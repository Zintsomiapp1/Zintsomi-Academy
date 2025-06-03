
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Tag } from 'lucide-react';

const Cart = () => {
  const cartItems = []; // Empty cart

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            0 items
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">
                  Browse our courses and add your favorites to your cart
                </p>
                <Button>Browse Courses</Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>$0.00</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>$0.00</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>$0.00</span>
                </div>
                
                {/* Coupon Code */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Coupon code" />
                    <Button variant="outline" size="sm">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button className="w-full" size="lg" disabled={true}>
                  Proceed to Checkout
                </Button>
                
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
