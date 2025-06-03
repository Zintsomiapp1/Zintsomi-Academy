
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, Headphones, Play, Star, Heart, MessageCircle, Zap, Upload } from 'lucide-react';

const Stories = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const storyCategories = [
    'All',
    'VR Experiences',
    'Digital Stories',
    'Audio Stories',
    'Interactive Tales'
  ];

  const stories = [
    // Empty array - ready for real content
  ];

  const filteredStories = activeCategory === 'All' 
    ? stories 
    : stories.filter(story => story.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {storyCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Empty State */}
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
      </div>
    </div>
  );
};

export default Stories;
