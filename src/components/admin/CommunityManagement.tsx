
import React, { useState } from 'react';
import { Check, X, Eye, Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CommunityManagement = () => {
  // Sample pending testimonials
  const [pendingTestimonials, setPendingTestimonials] = useState([
    {
      id: '1',
      userName: 'Sarah Johnson',
      feedback: 'This platform has been incredible for teaching my kids about African culture!',
      rating: 5,
      submittedDate: '2024-03-20',
      status: 'pending'
    },
    {
      id: '2',
      userName: 'Michael Chen',
      feedback: 'The VR experiences are mind-blowing. My students love the interactive stories.',
      rating: 5,
      submittedDate: '2024-03-19',
      status: 'pending'
    }
  ]);

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
            <div className="text-2xl font-bold text-sky-800">47</div>
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
            <div className="text-2xl font-bold text-emerald-800">4.9</div>
            <p className="text-sm text-emerald-600">From all testimonials</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Testimonials */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Pending Testimonials</h3>
        
        {pendingTestimonials.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No pending testimonials</h4>
              <p className="text-gray-600">All testimonials have been reviewed</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-sky-400 to-teal-500 text-white font-semibold">
                            {getInitials(testimonial.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.userName}</h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              Submitted {testimonial.submittedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 italic mb-4">
                        "{testimonial.feedback}"
                      </p>
                      
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Pending Review
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(testimonial.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        onClick={() => handleReject(testimonial.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityManagement;
