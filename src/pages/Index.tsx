
import React, { useState } from 'react';
import Welcome from './Welcome';
import Auth from './Auth';
import Courses from './Courses';
import KhaluluOwl from '@/components/KhaluluOwl';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'auth' | 'courses'>('welcome');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setCurrentPage('courses');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('welcome');
  };

  const handleShowAuth = () => {
    setCurrentPage('auth');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
  };

  if (currentPage === 'auth') {
    return <Auth onLogin={handleLogin} onBack={handleBackToWelcome} />;
  }

  if (currentPage === 'courses' && user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Courses user={user} onLogout={handleLogout} />
        
        {/* Greeting from Khalulu */}
        <div className="fixed bottom-4 right-4 z-50">
          <KhaluluOwl 
            userName={user.name}
            className="scale-75"
          />
        </div>
      </div>
    );
  }

  return (
    <Welcome 
      onLogin={handleShowAuth}
      onSignUp={handleShowAuth}
    />
  );
};

export default Index;
