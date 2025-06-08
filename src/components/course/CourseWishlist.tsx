
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface WishlistItem {
  id: string;
  title: string;
  instructor: string;
  price: number;
  image: string;
}

const CourseWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            My Wishlist (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="bg-gray-100 rounded-lg p-8">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
              <p className="text-sm">Browse courses and save your favorites here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseWishlist;
