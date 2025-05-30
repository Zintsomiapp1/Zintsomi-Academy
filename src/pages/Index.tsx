
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/lovable-uploads/e153d080-0e68-4853-b008-897623780941.png"
            alt="Khalulu the Owl"
            className="w-16 h-16 object-contain mx-auto mb-4 animate-bounce"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show user dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
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
