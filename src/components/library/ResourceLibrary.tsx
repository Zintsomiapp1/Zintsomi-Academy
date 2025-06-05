
import React, { useState } from 'react';
import { Search, Download, Play, FileText, Headphones, Video, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'audio' | 'pdf' | 'video';
  category: 'folklore' | 'storytelling_tips' | 'vr_lessons';
  url: string;
  tags: string[];
  duration?: string;
}

// Sample data - this would come from Supabase in real implementation
const sampleResources: Resource[] = [
  {
    id: '1',
    title: 'African Folklore Collection',
    description: 'A comprehensive audio collection of traditional African stories',
    type: 'audio',
    category: 'folklore',
    url: '#',
    tags: ['traditional', 'africa', 'oral'],
    duration: '45 min'
  },
  {
    id: '2',
    title: 'Storytelling Techniques Guide',
    description: 'PDF guide covering advanced storytelling methods and techniques',
    type: 'pdf',
    category: 'storytelling_tips',
    url: '#',
    tags: ['techniques', 'guide', 'advanced']
  },
  {
    id: '3',
    title: 'VR Storytelling Introduction',
    description: 'Video tutorial on creating immersive storytelling experiences in VR',
    type: 'video',
    category: 'vr_lessons',
    url: '#',
    tags: ['vr', 'immersive', 'tutorial'],
    duration: '25 min'
  },
  {
    id: '4',
    title: 'Voice Modulation for Storytellers',
    description: 'Audio exercises to improve your storytelling voice',
    type: 'audio',
    category: 'storytelling_tips',
    url: '#',
    tags: ['voice', 'modulation', 'practice'],
    duration: '30 min'
  }
];

const ResourceLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Headphones className="w-5 h-5" />;
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audio': return 'bg-purple-100 text-purple-700';
      case 'pdf': return 'bg-red-100 text-red-700';
      case 'video': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'folklore': return 'Folklore';
      case 'storytelling_tips': return 'Storytelling Tips';
      case 'vr_lessons': return 'VR Lessons';
      default: return category;
    }
  };

  const filteredResources = sampleResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resource Library</h2>
        <p className="text-gray-600">Discover audio stories, guides, and video tutorials to enhance your storytelling journey</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search resources, tags, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-lg border-gray-300 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Topics</option>
            <option value="folklore">Folklore</option>
            <option value="storytelling_tips">Storytelling Tips</option>
            <option value="vr_lessons">VR Lessons</option>
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Types</option>
            <option value="audio">Audio</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white rounded-xl overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                  {getIcon(resource.type)}
                </div>
                <Badge variant="outline" className="text-xs">
                  {getCategoryName(resource.category)}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-sky-600 transition-colors">
                {resource.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {resource.description}
              </p>

              {resource.duration && (
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Play className="w-3 h-3 mr-1" />
                  <span>{resource.duration}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-500 hover:to-sky-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                size="sm"
              >
                <Download className="w-3 h-3 mr-2" />
                {resource.type === 'video' ? 'Watch' : resource.type === 'audio' ? 'Listen' : 'Download'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
