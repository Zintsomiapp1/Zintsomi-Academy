
import React, { useState } from 'react';
import Welcome from './Welcome';
import Auth from './Auth';
import { useAuth } from '@/hooks/useAuth';
import UserDashboard from '@/components/user/UserDashboard';
import AskKhalulu from '@/components/AskKhalulu';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'auth' | 'dashboard'>('welcome');
  const { user, loading } = useAuth();

  const handleLogin = (userData: { name: string; email: string }) => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentPage('welcome');
  };

  const handleShowAuth = () => {
    setCurrentPage('auth');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center px-4">
        <div className="text-center">
          <img
            src="/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png"
            alt="Khalulu the storyteller"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-4 animate-bounce"
          />
          <p className="text-white font-medium text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show user dashboard with Ask Khalulu prominently
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
          {/* Ask Khalulu Section - Prominently positioned */}
          <div className="mb-6 sm:mb-8">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 px-2">
                Need Help? Ask Khalulu the Storyteller!
              </h2>
              <p className="text-gray-600 text-sm sm:text-base px-2">
                Your friendly AI companion is here to help with any questions about your learning journey.
              </p>
            </div>
            <div className="px-2">
              <AskKhalulu />
            </div>
          </div>
          
          <div className="px-2">
            <UserDashboard />
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'auth') {
    return <Auth onLogin={handleLogin} onBack={handleBackToWelcome} />;
  }

  return (
    <Welcome 
      onLogin={handleShowAuth}
      onSignUp={handleShowAuth}
    />
  );
};

export default Index;
