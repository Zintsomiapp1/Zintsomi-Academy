
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';

interface WishlistItem {
  id: string;
  title: string;
  instructor: string;
  price: number;
  image: string;
}

const CourseWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      title: 'Advanced JavaScript Concepts',
      instructor: 'John Doe',
      price: 99.99,
      image: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'React Native Development',
      instructor: 'Jane Smith',
      price: 149.99,
      image: '/placeholder.svg'
    }
  ]);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const moveToCart = (id: string) => {
    // Implementation for adding to cart
    console.log('Moving to cart:', id);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            My Wishlist ({wishlistItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wishlistItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Your wishlist is empty</p>
              <p className="text-sm">Browse courses and save your favorites here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">by {item.instructor}</p>
                    <p className="text-lg font-semibold text-green-600">${item.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => moveToCart(item.id)}>
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseWishlist;
