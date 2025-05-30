import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Headphones, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Extend the Window interface to include AFRAME
declare global {
  interface Window {
    AFRAME: any;
  }
}

const VRContent = () => {
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [componentMounted, setComponentMounted] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const message = `${timestamp}: ${info}`;
    console.log('VR Debug:', message);
    setDebugInfo(prev => [...prev, message]);
  };

  useEffect(() => {
    setComponentMounted(true);
    addDebugInfo('VRContent component mounted successfully');
    addDebugInfo(`Window object exists: ${typeof window !== 'undefined'}`);
    addDebugInfo(`Document ready state: ${document.readyState}`);
    
    // Check if A-Frame is already loaded
    if (window.AFRAME) {
      addDebugInfo('A-Frame already available on window');
      setAframeLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="aframe"]');
    if (existingScript) {
      addDebugInfo('A-Frame script already exists in document');
      const checkAFrame = setInterval(() => {
        if (window.AFRAME) {
          addDebugInfo('A-Frame became available');
          setAframeLoaded(true);
          clearInterval(checkAFrame);
        }
      }, 100);
      
      setTimeout(() => {
        if (!window.AFRAME) {
          addDebugInfo('Timeout waiting for existing A-Frame script');
          clearInterval(checkAFrame);
        }
      }, 5000);
      return;
    }

    addDebugInfo('Creating new A-Frame script element');
    // Load A-Frame script
    const script = document.createElement('script');
    script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      addDebugInfo('A-Frame script onload event fired');
      // Wait for A-Frame to fully initialize
      let attempts = 0;
      const maxAttempts = 50;
      const checkAFrame = setInterval(() => {
        attempts++;
        if (window.AFRAME) {
          addDebugInfo(`A-Frame fully initialized after ${attempts} attempts`);
          setAframeLoaded(true);
          clearInterval(checkAFrame);
        } else if (attempts >= maxAttempts) {
          addDebugInfo(`Failed to initialize A-Frame after ${maxAttempts} attempts`);
          setError('A-Frame failed to initialize properly');
          clearInterval(checkAFrame);
        }
      }, 100);
    };

    script.onerror = (e) => {
      addDebugInfo(`Failed to load A-Frame script: ${e}`);
      setError('Failed to load A-Frame from CDN');
      console.error('A-Frame load error:', e);
    };

    addDebugInfo('Appending A-Frame script to document head');
    document.head.appendChild(script);

    return () => {
      addDebugInfo('Component unmounting, cleaning up');
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Create the VR scene after A-Frame loads
  useEffect(() => {
    if (aframeLoaded && sceneRef.current) {
      addDebugInfo('Creating VR scene - A-Frame loaded and ref available');
      addDebugInfo(`Scene ref current: ${sceneRef.current ? 'exists' : 'null'}`);
      
      // Clear any existing content
      sceneRef.current.innerHTML = '';
      
      try {
        addDebugInfo('Generating VR scene HTML');
        const sceneHTML = `
          <a-scene
            embedded
            style="height: 600px; width: 100%; display: block;"
            vr-mode-ui="enabled: true"
            background="color: #87CEEB"
            debug
          >
            <!-- Assets -->
            <a-assets>
              <!-- Removed audio to avoid autoplay issues -->
            </a-assets>

            <!-- Lighting -->
            <a-light type="ambient" color="#404040"></a-light>
            <a-light type="directional" position="1 1 1" color="#ffffff"></a-light>

            <!-- Ground -->
            <a-plane 
              position="0 0 -4" 
              rotation="-90 0 0" 
              width="20" 
              height="20" 
              color="#7BC043"
              shadow
            ></a-plane>

            <!-- Test cube to ensure something renders -->
            <a-box 
              position="0 2 -5" 
              color="#FF0000"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 5000"
            ></a-box>

            <!-- Welcome text -->
            <a-text 
              position="0 3 -5" 
              value="VR Scene Loaded Successfully!" 
              align="center" 
              color="#333"
              width="8"
            ></a-text>

            <!-- Sky -->
            <a-sky color="#87CEEB"></a-sky>

            <!-- Camera with controls -->
            <a-camera 
              look-controls 
              wasd-controls 
              position="0 1.6 0"
            ></a-camera>
          </a-scene>
        `;
        
        addDebugInfo('Setting innerHTML for scene container');
        sceneRef.current.innerHTML = sceneHTML;
        addDebugInfo('VR scene HTML injected successfully');
        
        // Check if scene was created
        setTimeout(() => {
          const sceneElement = sceneRef.current?.querySelector('a-scene');
          if (sceneElement) {
            addDebugInfo('A-Scene element found in DOM');
            addDebugInfo(`Scene element style: ${sceneElement.getAttribute('style')}`);
          } else {
            addDebugInfo('A-Scene element NOT found in DOM');
            setError('Failed to create A-Scene element');
          }
        }, 1000);
        
      } catch (e) {
        addDebugInfo(`Error creating scene: ${e}`);
        setError(`Failed to create VR scene: ${e}`);
      }
    } else {
      if (!aframeLoaded) {
        addDebugInfo('Waiting for A-Frame to load');
      }
      if (!sceneRef.current) {
        addDebugInfo('Scene ref not available yet');
      }
    }
  }, [aframeLoaded]);

  const handleBack = () => {
    window.history.back();
  };

  const renderVRScene = () => {
    if (error) {
      return (
        <div className="flex items-center justify-center bg-red-50 border-2 border-red-200" style={{ height: '600px' }}>
          <div className="text-center p-8">
            <div className="text-red-500 mb-4 text-lg font-semibold">❌ {error}</div>
            <p className="text-gray-600">VR content failed to load</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (!aframeLoaded) {
      return (
        <div className="flex items-center justify-center bg-blue-50 border-2 border-blue-200" style={{ height: '600px' }}>
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading VR Experience...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while A-Frame initializes</p>
            <p className="text-xs text-gray-400 mt-4">
              {componentMounted ? 'Component mounted' : 'Component not mounted'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div 
        ref={sceneRef}
        className="relative border-4 border-green-500 bg-gray-100" 
        style={{ 
          height: '600px', 
          width: '100%',
          minHeight: '600px',
          display: 'block'
        }}
      >
        {/* Fallback content if VR scene doesn't render */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p>VR Scene Container Ready</p>
            <p className="text-sm">A-Frame: {aframeLoaded ? 'Loaded' : 'Not Loaded'}</p>
          </div>
        </div>
      </div>
    );
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

        {/* Debug Info - Always visible for troubleshooting */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              Debug Information
              <span className="text-xs text-gray-500">
                Component: {componentMounted ? 'Mounted' : 'Not Mounted'} | 
                A-Frame: {aframeLoaded ? 'Loaded' : 'Loading'} | 
                Error: {error ? 'Yes' : 'No'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono space-y-1 max-h-40 overflow-y-auto bg-gray-50 p-4 rounded">
              {debugInfo.length > 0 ? (
                debugInfo.map((info, index) => (
                  <div key={index} className="text-gray-600">{info}</div>
                ))
              ) : (
                <div className="text-red-600">No debug information available - component may not be loading</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* VR Scene */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>VR Scene</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {renderVRScene()}
          </CardContent>
        </Card>

        {/* Status */}
        {aframeLoaded && !error && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ A-Frame loaded successfully! The VR scene should be visible above.
            </p>
          </div>
        )}

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
