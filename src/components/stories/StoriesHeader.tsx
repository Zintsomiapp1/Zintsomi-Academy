
import React from 'react';
import { BookOpen, Zap } from 'lucide-react';

const StoriesHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <BookOpen className="w-12 h-12 text-purple-600" />
        <h1 className="text-4xl font-bold text-gray-900">Digital Stories & VR Experiences</h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Immerse yourself in interactive stories, virtual reality experiences, and digital narratives
      </p>

      {/* Stories Advertisement */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 max-w-4xl mx-auto border border-purple-200">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Zap className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Immersive Storytelling!</h2>
        </div>
        <p className="text-gray-700 mb-2">
          📖 Experience stories like never before with VR and interactive digital content
        </p>
        <p className="text-sm text-gray-600">
          From traditional folklore to modern digital narratives - all in one place!
        </p>
      </div>
    </div>
  );
};

export default StoriesHeader;
