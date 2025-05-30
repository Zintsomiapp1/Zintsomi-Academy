
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash2, Plus, Minus, Tag } from 'lucide-react';

const Cart = () => {
  const cartItems = [
    {
      id: '1',
      title: 'Introduction to IsiZulu Storytelling',
      creator: 'Dr. Amara Okafor',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      price: 29.99,
      originalPrice: 49.99,
      quantity: 1
    },
    {
      id: '2',
      title: 'Digital Storytelling Techniques',
      creator: 'Sarah Johnson',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      price: 39.99,
      originalPrice: 59.99,
      quantity: 1
    }
  ];

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
            {cartItems.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
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
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full md:w-32 h-20 object-cover rounded"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">by {item.creator}</p>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-gray-500 line-through text-sm">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 border rounded">{item.quantity}</span>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 ml-2">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
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
                
                <Button className="w-full" size="lg" disabled={cartItems.length === 0}>
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
