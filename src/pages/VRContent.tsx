
import React, { useEffect } from 'react';
import { ArrowLeft, Headphones, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VRContent = () => {
  useEffect(() => {
    // Load A-Frame script
    const script = document.createElement('script');
    script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleBack = () => {
    window.history.back();
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
              src="/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png"
              alt="Khalulu"
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
                <p className="text-sm text-gray-600">Drag to look around the 3D environment</p>
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
                <h4 className="font-semibold mb-1">Click Objects</h4>
                <p className="text-sm text-gray-600">Interact with elements in the scene</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VR Scene */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative" style={{ height: '600px' }}>
              <a-scene
                embedded
                style={{ height: '100%', width: '100%' }}
                vr-mode-ui="enabled: true"
                background="color: #87CEEB"
              >
                {/* Assets */}
                <a-assets>
                  <a-sound id="ambient-sound" src="https://cdn.freesound.org/previews/316/316847_4939433-lq.mp3" autoplay="true" loop="true" volume="0.3"></a-sound>
                </a-assets>

                {/* Lighting */}
                <a-light type="ambient" color="#404040"></a-light>
                <a-light type="directional" position="1 1 1" color="#ffffff"></a-light>

                {/* Ground */}
                <a-plane 
                  position="0 0 -4" 
                  rotation="-90 0 0" 
                  width="20" 
                  height="20" 
                  color="#7BC043"
                  shadow
                ></a-plane>

                {/* Traditional African Hut */}
                <a-cylinder 
                  position="-3 1 -6" 
                  radius="2" 
                  height="2" 
                  color="#8B4513"
                  shadow
                ></a-cylinder>
                <a-cone 
                  position="-3 3 -6" 
                  radius-bottom="2.5" 
                  radius-top="0.5" 
                  height="2" 
                  color="#DAA520"
                  shadow
                ></a-cone>

                {/* Baobab Tree */}
                <a-cylinder 
                  position="3 1.5 -8" 
                  radius="0.8" 
                  height="3" 
                  color="#8B4513"
                  shadow
                ></a-cylinder>
                <a-sphere 
                  position="3 4 -8" 
                  radius="2" 
                  color="#228B22"
                  shadow
                ></a-sphere>

                {/* Storytelling Circle */}
                <a-ring 
                  position="0 0.1 -5" 
                  radius-inner="2" 
                  radius-outer="3" 
                  color="#D2691E"
                  rotation="-90 0 0"
                ></a-ring>

                {/* Interactive Story Stones */}
                <a-box 
                  position="-1 0.5 -4" 
                  width="0.5" 
                  height="0.5" 
                  depth="0.5" 
                  color="#FF6B6B"
                  animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
                  class="clickable"
                  shadow
                ></a-box>
                <a-box 
                  position="1 0.5 -4" 
                  width="0.5" 
                  height="0.5" 
                  depth="0.5" 
                  color="#4ECDC4"
                  animation="property: rotation; to: 0 360 0; loop: true; dur: 8000"
                  class="clickable"
                  shadow
                ></a-box>
                <a-box 
                  position="0 0.5 -3" 
                  width="0.5" 
                  height="0.5" 
                  depth="0.5" 
                  color="#45B7D1"
                  animation="property: rotation; to: 0 360 0; loop: true; dur: 12000"
                  class="clickable"
                  shadow
                ></a-box>

                {/* Floating Text */}
                <a-text 
                  position="0 3 -5" 
                  value="Welcome to African Storytelling" 
                  align="center" 
                  color="#333"
                  width="8"
                  animation="property: position; to: 0 3.5 -5; loop: true; dir: alternate; dur: 3000"
                ></a-text>

                {/* Khalulu mascot */}
                <a-sphere 
                  position="0 2 -2" 
                  radius="0.3" 
                  color="#FFE4B5"
                  animation="property: position; to: 0.5 2.2 -2; loop: true; dir: alternate; dur: 2000"
                  shadow
                ></a-sphere>
                <a-text 
                  position="0 1.5 -2" 
                  value="Hi! I'm Khalulu!" 
                  align="center" 
                  color="#333"
                  width="4"
                ></a-text>

                {/* Sky */}
                <a-sky color="#87CEEB"></a-sky>

                {/* Camera with controls */}
                <a-camera 
                  look-controls 
                  wasd-controls 
                  position="0 1.6 0"
                >
                  <a-cursor
                    animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150"
                    animation__fusing="property: scale; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500"
                    raycaster="objects: .clickable"
                    geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
                    material="color: #FF6B6B; shader: flat"
                  ></a-cursor>
                </a-camera>
              </a-scene>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
              </div>
              <h3 className="font-semibold mb-2">Interactive Elements</h3>
              <p className="text-gray-600 text-sm">Click on the floating cubes to trigger story events</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
              <h3 className="font-semibold mb-2">Immersive Environment</h3>
              <p className="text-gray-600 text-sm">Explore a traditional African village setting</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
              <h3 className="font-semibold mb-2">Cultural Learning</h3>
              <p className="text-gray-600 text-sm">Learn about African traditions through VR</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VRContent;
