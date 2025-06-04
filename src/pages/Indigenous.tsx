
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Music, Gamepad2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Indigenous = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Indigenous Heritage
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Explore the rich cultural heritage of indigenous communities through traditional games, 
            musical instruments, and interactive experiences that preserve and celebrate our ancestors' wisdom.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Indigenous Games Section */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-sky-600" />
                </div>
                Indigenous Games
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Discover traditional games that have been passed down through generations, 
                each carrying cultural significance and community values.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-700">Traditional strategy games</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Community building activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Cultural learning experiences</span>
                </div>
              </div>
              <Link to="/indigenous-games">
                <Button className="w-full bg-sky-600 hover:bg-sky-700">
                  Explore Indigenous Games
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Indigenous Instruments Section */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-blue-600" />
                </div>
                Indigenous Instruments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Learn about traditional musical instruments, their history, cultural significance, 
                and how they connect communities through sound and rhythm.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Traditional instrument catalog</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Cultural storytelling through music</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-700">Interactive learning experiences</span>
                </div>
              </div>
              <Link to="/indigenous-instruments">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Discover Instruments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Cultural Significance Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cultural Preservation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-sky-600" />
                </div>
                <h3 className="font-semibold mb-2">Community Connection</h3>
                <p className="text-sm text-gray-600">
                  Strengthening bonds through shared cultural experiences and traditional practices.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Heritage Preservation</h3>
                <p className="text-sm text-gray-600">
                  Keeping ancestral knowledge alive for future generations through interactive learning.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-2">Cultural Expression</h3>
                <p className="text-sm text-gray-600">
                  Celebrating diversity through music, games, and traditional storytelling methods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Indigenous;
