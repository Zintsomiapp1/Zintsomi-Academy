import React from 'react';
import { Heart, MessageCircle, Users, Zap, Camera, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const Welcome = ({ onLogin, onSignUp }: WelcomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mjolo-coral via-mjolo-pink to-mjolo-purple">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <img
                src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
                alt="Mjolo logo"
                className="w-24 h-24 object-contain animate-bounce"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Find Your{' '}
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent font-extrabold block sm:inline">
                Perfect Match
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-medium">
              Africa's most exciting dating platform. Connect authentically, chat safely, and find meaningful relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onSignUp}
                className="bg-white text-mjolo-purple hover:bg-white/90 px-8 py-4 font-semibold text-lg shadow-lg"
              >
                Start Dating Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onLogin}
                className="px-8 py-4 text-white border-white/30 hover:bg-white/10 backdrop-blur-sm font-semibold text-lg"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose Mjolo?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              The smartest way to meet amazing people across Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-xl transition-all bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">Smart Matching</h3>
                <p className="text-white/80 text-sm">
                  Our AI finds your perfect matches based on compatibility and shared interests
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">Safe Chat</h3>
                <p className="text-white/80 text-sm">
                  Secure messaging with photo verification and privacy controls
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">Photo Swap</h3>
                <p className="text-white/80 text-sm">
                  Exchange photos safely with mutual consent and verification
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">Quiz Battles</h3>
                <p className="text-white/80 text-sm">
                  Fun quizzes to break the ice and discover compatibility
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">Date Rooms</h3>
                <p className="text-white/80 text-sm">
                  Virtual date spaces to connect before meeting in person
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">Verified Profiles</h3>
                <p className="text-white/80 text-sm">
                  All profiles are verified for authentic and safe connections
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Love?
          </h2>
          <p className="text-white/80 mb-8 text-xl">
            Join thousands of singles across Africa finding meaningful connections
          </p>
          <Button 
            size="lg" 
            onClick={onSignUp}
            className="bg-white text-mjolo-purple hover:bg-white/90 px-12 py-4 font-bold text-xl shadow-xl"
          >
            Join Mjolo Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
