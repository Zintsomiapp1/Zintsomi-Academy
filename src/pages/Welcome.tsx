
import React from 'react';
import { Button } from '@/components/ui/button';
import KhaluluOwl from '@/components/KhaluluOwl';

interface WelcomeProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const Welcome = ({ onLogin, onSignUp }: WelcomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="text-center pt-16 pb-8">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/lovable-uploads/e153d080-0e68-4853-b008-897623780941.png"
            alt="Khalulu the Owl"
            className="w-16 h-16 object-contain animate-bounce"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2 animate-fade-in">Zintsomi College</h1>
        <p className="text-gray-600 text-lg animate-fade-in">AI-Powered Storytelling & Learning Platform</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Join the Zintsomi College
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Discover the magic of storytelling through AI-powered courses, immersive VR experiences, 
            and interactive learning in multiple African languages.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onSignUp}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-8 py-3 text-lg font-semibold"
            >
              Get Started
            </Button>
            <Button
              onClick={onLogin}
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-3 text-lg font-semibold"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">📚</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Multi-Language Courses</h3>
            <p className="text-gray-600 text-sm">Learn storytelling in IsiZulu, Nguni, Sesotho, English, and Sepedi</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI-Powered Stories</h3>
            <p className="text-gray-600 text-sm">Create personalized characters and interactive narratives with AI</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🥽</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">VR Experiences</h3>
            <p className="text-gray-600 text-sm">Immerse yourself in virtual reality storytelling environments</p>
          </div>
        </div>
      </div>

      {/* Khalulu Owl at Bottom */}
      <div className="pb-8">
        <KhaluluOwl className="animate-fade-in" />
      </div>
    </div>
  );
};

export default Welcome;
