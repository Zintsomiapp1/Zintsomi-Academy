
import React, { useState } from 'react';
import { Play, ExternalLink, Music, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InstrumentVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeUrl: string;
  instrument: string;
}

const IndigenousInstruments = () => {
  const [instruments] = useState<InstrumentVideo[]>([]); // Empty instruments array

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Music className="w-16 h-16 text-green-600 mr-4" />
            <img
              src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
              alt="Mjolo logo"
              className="w-16 h-16 object-contain animate-bounce"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Indigenous Instruments
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn to play traditional African instruments through our curated video collection. 
            Discover the rich musical heritage of Africa.
          </p>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-lg p-12 max-w-md mx-auto">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Instruments Available</h3>
            <p className="text-gray-500 mb-4">Ready for new content to be added</p>
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
              <span className="text-gray-400">Upload Image</span>
            </div>
          </div>
        </div>

        {/* Upload Message */}
        <div className="mt-12 text-center">
          <div className="bg-green-50 rounded-lg p-6 max-w-2xl mx-auto">
            <Music className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Ready for New Instruments!
            </h3>
            <p className="text-green-700">
              This section is ready for new instrument tutorials to be added.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndigenousInstruments;
