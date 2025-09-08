import React from 'react';
import { Heart, MessageCircle, Users, Zap, Camera, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const Welcome = ({ onLogin, onSignUp }: WelcomeProps) => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-mjolo-pink via-mjolo-purple to-mjolo-coral"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <img
              src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
              alt="Mjolo logo"
              className="w-24 h-24 object-contain mx-auto mb-6 animate-bounce"
            />
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h1>
            <p className="text-white/90 text-lg mb-8 px-4">
              Africa's most exciting dating platform. Connect authentically and find love.
            </p>
          </div>

          {/* Feature Icons */}
          <div className="flex justify-center space-x-6 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Smart Match</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Safe Chat</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/80 text-xs">Photo Swap</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              size="lg" 
              onClick={onSignUp}
              className="w-full bg-white text-mjolo-purple hover:bg-white/90 py-4 font-bold text-lg shadow-xl rounded-2xl"
            >
              Create Account
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onLogin}
              className="w-full py-4 text-white border-white/30 hover:bg-white/10 backdrop-blur-sm font-semibold text-lg rounded-2xl"
            >
              Sign In
            </Button>
          </div>

          {/* Terms */}
          <p className="text-white/60 text-xs mt-8 px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
