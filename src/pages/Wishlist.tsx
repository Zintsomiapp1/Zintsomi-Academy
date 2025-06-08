
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const wishlistItems = []; // Empty wishlist

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
            0 items
          </span>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="p-12 text-center">
            <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Browse our courses and add your favorites to your wishlist
              </p>
              <Button>Browse Courses</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wishlist;
