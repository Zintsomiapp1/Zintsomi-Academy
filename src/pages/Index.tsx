
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
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-green-400 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/lovable-uploads/e153d080-0e68-4853-b008-897623780941.png"
            alt="Khalulu the Owl"
            className="w-16 h-16 object-contain mx-auto mb-4 animate-bounce"
          />
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show user dashboard with Ask Khalulu prominently
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
        <div className="container mx-auto px-4 py-8">
          {/* Ask Khalulu Section - Prominently positioned */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Need Help? Ask Khalulu!
              </h2>
              <p className="text-blue-100">
                Your friendly AI companion is here to help with any questions about your learning journey.
              </p>
            </div>
            <AskKhalulu />
          </div>
          
          <UserDashboard />
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
