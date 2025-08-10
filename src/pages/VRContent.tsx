
import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Headphones, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VRContent = () => {
  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    console.log('VRContent component mounted');
    setStatus('ready');
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const handleTryDemo = () => {
    setStatus('demo-started');
    // Simple demo without A-Frame for now
    setTimeout(() => {
      setStatus('demo-complete');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="outline" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center flex-1">
            <img
              src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
              alt="Mjolo logo"
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              VR Storytelling Experience
            </h1>
            <p className="text-xl text-gray-600">
              Immerse yourself in African tales through virtual reality
            </p>
          </div>
        </div>

        {/* Status Display */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>VR Experience Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              {status === 'initializing' && (
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Initializing VR Experience...</p>
                </div>
              )}
              
              {status === 'ready' && (
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-green-600 font-semibold mb-4">VR Experience Ready!</p>
                  <Button onClick={handleTryDemo} className="bg-purple-600 hover:bg-purple-700">
                    Start VR Demo
                  </Button>
                </div>
              )}
              
              {status === 'demo-started' && (
                <div>
                  <div className="animate-pulse w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-blue-600 font-semibold">VR Demo Running...</p>
                  <p className="text-gray-600 text-sm mt-2">Simulating immersive storytelling experience</p>
                </div>
              )}
              
              {status === 'demo-complete' && (
                <div>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-purple-600 font-semibold mb-2">Demo Complete!</p>
                  <p className="text-gray-600 text-sm mb-4">Thank you for trying our VR storytelling experience</p>
                  <Button onClick={() => setStatus('ready')} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}
              
              {error && (
                <div>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl">⚠️</span>
                  </div>
                  <p className="text-red-600 font-semibold mb-2">Error</p>
                  <p className="text-gray-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              How to Experience VR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-1">Look Around</h4>
                <p className="text-sm text-gray-600">Explore immersive 3D storytelling environments</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Headphones className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-1">Use Headphones</h4>
                <p className="text-sm text-gray-600">For the best immersive audio experience</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="w-6 h-6 bg-green-600 rounded"></div>
                </div>
                <h4 className="font-semibold mb-1">Interact</h4>
                <p className="text-sm text-gray-600">Click elements to progress through stories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
              </div>
              <h3 className="font-semibold mb-2">Interactive Stories</h3>
              <p className="text-gray-600 text-sm">Experience African tales in immersive 3D environments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
              <h3 className="font-semibold mb-2">Cultural Learning</h3>
              <p className="text-gray-600 text-sm">Learn about African traditions through VR storytelling</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
              <h3 className="font-semibold mb-2">Immersive Audio</h3>
              <p className="text-gray-600 text-sm">Rich storytelling with authentic African music and voices</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VRContent;
