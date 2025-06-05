
import React, { useState } from 'react';
import { Check, X, Eye, Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CommunityManagement = () => {
  // Empty array - ready for real pending testimonials
  const [pendingTestimonials, setPendingTestimonials] = useState<any[]>([]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleApprove = (id: string) => {
    setPendingTestimonials(prev => prev.filter(t => t.id !== id));
    // In real implementation, this would update the database
  };

  const handleReject = (id: string) => {
    setPendingTestimonials(prev => prev.filter(t => t.id !== id));
    // In real implementation, this would update the database
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Management</h2>
        <p className="text-gray-600">Review and manage user testimonials and feedback</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sky-700">
              <MessageSquare className="w-5 h-5" />
              <span>Published</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-800">0</div>
            <p className="text-sm text-sky-600">Total testimonials</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <Eye className="w-5 h-5" />
              <span>Pending Review</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{pendingTestimonials.length}</div>
            <p className="text-sm text-orange-600">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-emerald-700">
              <Star className="w-5 h-5" />
              <span>Avg Rating</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">-</div>
            <p className="text-sm text-emerald-600">No ratings yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Testimonials */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Pending Testimonials</h3>
        
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No pending testimonials</h4>
            <p className="text-gray-600">Testimonials submitted by users will appear here for review</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityManagement;
