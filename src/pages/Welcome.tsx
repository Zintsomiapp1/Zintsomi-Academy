import React from 'react';
import { Play, Star, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const Welcome = ({ onLogin, onSignUp }: WelcomeProps) => {
  const handleVRDemo = () => {
    window.location.href = '/vr-content';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <img
                src="/lovable-uploads/e153d080-0e68-4853-b008-897623780941.png"
                alt="Khalulu the storyteller"
                className="w-20 h-20 object-contain animate-bounce"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Welcome to{' '}
              <span className="text-slate-900 font-extrabold">
                Zintsomi College
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium">
              Discover the magic of storytelling through AI-powered courses, immersive VR experiences, 
              and interactive learning in multiple African languages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onSignUp}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 font-semibold"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onLogin}
                className="px-8 py-3 border-slate-700 text-slate-800 hover:bg-slate-800 hover:text-white border-2"
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleVRDemo}
                className="px-8 py-3 border-slate-700 text-slate-800 hover:bg-slate-800 hover:text-white border-2"
              >
                Try VR Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Learn Through Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience learning like never before with our innovative approach to education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Interactive Stories</h3>
                <p className="text-gray-600 text-sm">
                  Engage with immersive storytelling experiences
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">VR Content</h3>
                <p className="text-gray-600 text-sm">
                  Step into virtual worlds and experience stories firsthand
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600 text-sm">
                  Join a vibrant community of learners and storytellers
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-gray-600 text-sm">
                  Personalized learning experiences powered by AI
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of learners exploring African storytelling traditions through modern technology
          </p>
          <Button 
            size="lg" 
            onClick={onSignUp}
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 font-semibold"
          >
            Start Learning Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
