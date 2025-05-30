
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserDashboard from '@/components/user/UserDashboard';
import AskKhalulu from '@/components/AskKhalulu';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your progress and continue your learning journey</p>
        </div>
        
        {/* Ask Khalulu Section - Moved to top */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Need Help? Ask Khalulu!
            </h2>
            <p className="text-gray-600">
              Your friendly AI companion is here to help with any questions about your learning journey.
            </p>
          </div>
          <AskKhalulu />
        </div>
        
        <UserDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
