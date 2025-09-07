import React from 'react';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Gamification = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <GamificationDashboard />
    </div>
  );
};

export default Gamification;