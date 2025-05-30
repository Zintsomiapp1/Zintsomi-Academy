
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, Headphones, Play, Star, Heart, MessageCircle, Zap } from 'lucide-react';

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
    {
      id: '1',
      title: 'Virtual Reality African Heritage Tour',
      creator: 'VR Studios Africa',
      thumbnail: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=225&fit=crop',
      likes: 567,
      comments: 89,
      isPremium: true,
      rating: 4.9,
      category: 'VR Experiences',
      duration: '2 hours',
      description: 'Immerse yourself in African heritage through virtual reality'
    },
    {
      id: '2',
      title: 'Immersive Zulu Village Experience',
      creator: 'Cultural VR Lab',
      thumbnail: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=225&fit=crop',
      likes: 234,
      comments: 45,
      isPremium: true,
      rating: 4.7,
      category: 'VR Experiences',
      duration: '1.5 hours',
      description: 'Experience traditional Zulu village life in virtual reality'
    },
    {
      id: '3',
      title: 'Interactive Historical Artifacts',
      creator: 'Museum AR',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop',
      likes: 445,
      comments: 78,
      isPremium: true,
      rating: 4.8,
      category: 'Digital Stories',
      duration: '3 hours',
      description: 'Explore historical artifacts through interactive storytelling'
    },
    {
      id: '4',
      title: 'Digital Folklore Collection',
      creator: 'Digital Storytellers',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      likes: 342,
      comments: 67,
      isPremium: false,
      rating: 4.6,
      category: 'Digital Stories',
      duration: '45 minutes',
      description: 'Traditional folklore brought to life through digital media'
    },
    {
      id: '5',
      title: 'Ancient Voices Audio Experience',
      creator: 'Heritage Audio',
      thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=225&fit=crop',
      likes: 189,
      comments: 34,
      isPremium: false,
      rating: 4.5,
      category: 'Audio Stories',
      duration: '2 hours',
      description: 'Listen to ancient stories narrated by traditional storytellers'
    },
    {
      id: '6',
      title: 'Choose Your Adventure: African Legends',
      creator: 'Interactive Media Lab',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      likes: 423,
      comments: 92,
      isPremium: true,
      rating: 4.8,
      category: 'Interactive Tales',
      duration: '1 hour',
      description: 'Make choices that shape your journey through African legends'
    }
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

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden rounded-2xl cursor-pointer">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={story.thumbnail}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
                {story.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    Premium
                  </Badge>
                )}
                <div className="absolute top-2 left-2">
                  {story.category === 'VR Experiences' && <Eye className="w-6 h-6 text-white" />}
                  {story.category === 'Audio Stories' && <Headphones className="w-6 h-6 text-white" />}
                  {story.category === 'Digital Stories' && <BookOpen className="w-6 h-6 text-white" />}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight">
                    {story.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600">{story.creator}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{story.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="text-purple-600 font-medium">{story.category}</span>
                    <span>{story.duration}</span>
                  </div>
                  
                  {story.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{story.rating}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{story.likes}</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{story.comments}</span>
                      </button>
                    </div>
                    
                    <Button size="sm">
                      Experience
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stories;
