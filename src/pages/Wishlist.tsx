
import React from 'react';
import CourseWishlist from '@/components/course/CourseWishlist';

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">Courses you've saved for later</p>
        </div>
        <CourseWishlist />
      </div>
    </div>
  );
};

export default Wishlist;
