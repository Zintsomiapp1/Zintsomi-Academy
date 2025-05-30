
import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeUrl: string;
}

const IndigenousGames = () => {
  // Placeholder data - you can replace with your actual YouTube videos later
  const [games] = useState<GameVideo[]>([
    {
      id: '1',
      title: 'Traditional African Stone Game',
      description: 'Learn the ancient art of stone throwing games.',
      thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder1'
    },
    {
      id: '2',
      title: 'Indigenous Stick Fighting',
      description: 'Traditional martial arts and stick fighting techniques.',
      thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder2'
    },
    {
      id: '3',
      title: 'African Board Games',
      description: 'Classic strategy games from African traditions.',
      thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder3'
    }
  ]);

  const handleVideoClick = (youtubeUrl: string) => {
    window.open(youtubeUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png"
            alt="Khalulu"
            className="w-20 h-20 object-contain mx-auto mb-6 animate-bounce"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Indigenous Games
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover traditional African games and learn about our rich cultural heritage through these interactive videos.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleVideoClick(game.youtubeUrl)}
            >
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {game.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {game.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoClick(game.youtubeUrl);
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Message */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              More Games Coming Soon!
            </h3>
            <p className="text-blue-700">
              We're constantly adding new indigenous games to our collection. 
              Check back regularly for fresh content and new cultural experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndigenousGames;
