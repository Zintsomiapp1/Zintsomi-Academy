
import React, { useState } from 'react';
import { Play, ExternalLink, Music } from 'lucide-react';
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
  const [instruments] = useState<InstrumentVideo[]>([
    {
      id: '1',
      title: 'How to Play the Mbira',
      description: 'Learn the traditional African thumb piano and its cultural significance.',
      thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder-mbira',
      instrument: 'Mbira'
    },
    {
      id: '2',
      title: 'Djembe Drumming Basics',
      description: 'Master the fundamental rhythms of this West African drum.',
      thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder-djembe',
      instrument: 'Djembe'
    },
    {
      id: '3',
      title: 'Marimba Playing Techniques',
      description: 'Explore the wooden xylophone traditions of Southern Africa.',
      thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder-marimba',
      instrument: 'Marimba'
    },
    {
      id: '4',
      title: 'Kalimba for Beginners',
      description: 'Start your journey with this portable thumb piano.',
      thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder-kalimba',
      instrument: 'Kalimba'
    },
    {
      id: '5',
      title: 'Kora String Instrument',
      description: 'Learn the 21-string bridge-harp from West Africa.',
      thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder-kora',
      instrument: 'Kora'
    },
    {
      id: '6',
      title: 'Traditional Flute Making',
      description: 'Discover how to craft and play traditional African flutes.',
      thumbnail: '/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder-flute',
      instrument: 'Flute'
    }
  ]);

  const handleVideoClick = (youtubeUrl: string) => {
    window.open(youtubeUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Music className="w-16 h-16 text-green-600 mr-4" />
            <img
              src="/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png"
              alt="Khalulu"
              className="w-16 h-16 object-contain animate-bounce"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Indigenous Instruments
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn to play traditional African instruments through our curated YouTube video collection. 
            Discover the rich musical heritage of Africa.
          </p>
        </div>

        {/* Instruments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instruments.map((instrument) => (
            <Card 
              key={instrument.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleVideoClick(instrument.youtubeUrl)}
            >
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={instrument.thumbnail}
                    alt={instrument.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {instrument.instrument}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {instrument.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {instrument.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoClick(instrument.youtubeUrl);
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch Tutorial
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Message */}
        <div className="mt-12 text-center">
          <div className="bg-green-50 rounded-lg p-6 max-w-2xl mx-auto">
            <Music className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              More Instruments Coming Soon!
            </h3>
            <p className="text-green-700">
              We're continuously adding new instrument tutorials to help you master 
              traditional African music. Check back regularly for new content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndigenousInstruments;
