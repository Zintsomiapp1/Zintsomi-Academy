
import React, { useState } from 'react';
import Welcome from './Welcome';
import Auth from './Auth';
import { useAuth } from '@/hooks/useAuth';
import UserDashboard from '@/components/user/UserDashboard';


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
      <div className="min-h-screen bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400 flex items-center justify-center px-4">
        <div className="text-center">
          <img
            src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
            alt="Mjolo logo"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-4 animate-bounce"
          />
          <p className="text-white font-medium text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show user dashboard with enhanced features
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
          
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
