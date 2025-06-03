
import React from 'react';
import { Upload } from 'lucide-react';

const StoriesEmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="bg-gray-100 rounded-lg p-12 max-w-md mx-auto">
        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Stories Available</h3>
        <p className="text-gray-500 mb-4">Ready for new content to be added</p>
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
          <span className="text-gray-400">Upload Image</span>
        </div>
      </div>
    </div>
  );
};

export default StoriesEmptyState;
