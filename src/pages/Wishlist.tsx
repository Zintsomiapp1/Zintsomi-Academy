
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Clock, ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist = () => {
  const wishlistItems = [
    {
      id: '1',
      title: 'Advanced African Narratives',
      creator: 'Prof. Thabo Mthembu',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
      rating: 4.6,
      duration: '5 hours',
      price: '$49.99',
      originalPrice: '$79.99',
      discount: 38
    },
    {
      id: '2',
      title: 'VR Storytelling Mastery',
      creator: 'Dr. Sarah Johnson',
      thumbnail: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=225&fit=crop',
      rating: 4.8,
      duration: '8 hours',
      price: '$99.99',
      originalPrice: '$149.99',
      discount: 33
    },
    {
      id: '3',
      title: 'AI-Powered Content Creation',
      creator: 'Prof. Michael Chen',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      rating: 4.9,
      duration: '6 hours',
      price: '$69.99',
      originalPrice: '$99.99',
      discount: 30
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
            {wishlistItems.length} items
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Browse our courses and add your favorites to your wishlist
              </p>
              <Button>Browse Courses</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-64">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                    {item.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        {item.discount}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-2">by {item.creator}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-gray-500 line-through">{item.originalPrice}</span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
                          Remove
                        </Button>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Total Savings</h3>
                    <p className="text-green-600 font-bold text-xl">$80.97</p>
                  </div>
                  <Button size="lg">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
