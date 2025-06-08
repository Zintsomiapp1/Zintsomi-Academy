
import React from 'react';
import { BookOpen } from 'lucide-react';

const StoriesEmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="bg-gray-100 rounded-lg p-12 max-w-md mx-auto">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Stories Available</h3>
        <p className="text-gray-500">Stories will appear here once they are added by the admin team. Check back soon for exciting storytelling content!</p>
      </div>
    </div>
  );
};

export default StoriesEmptyState;
