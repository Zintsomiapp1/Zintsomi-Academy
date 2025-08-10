
import React, { useState } from 'react';
import { Play, ExternalLink, Upload } from 'lucide-react';
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
  const [games] = useState<GameVideo[]>([]); // Empty games array

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
            alt="Mjolo logo"
            className="w-20 h-20 object-contain mx-auto mb-6 animate-bounce"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Indigenous Games
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover traditional African games and learn about our rich cultural heritage through these interactive videos.
          </p>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-lg p-12 max-w-md mx-auto">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Games Available</h3>
            <p className="text-gray-500 mb-4">Ready for new content to be added</p>
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
              <span className="text-gray-400">Upload Image</span>
            </div>
          </div>
        </div>

        {/* Upload Message */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Ready for New Games!
            </h3>
            <p className="text-blue-700">
              This section is ready for new indigenous games content to be added.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndigenousGames;
