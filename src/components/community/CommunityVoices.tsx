
import React from 'react';
import { MessageCircle, Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  id: string;
  userName: string;
  userAvatar?: string;
  feedback: string;
  rating?: number;
  date: string;
}

const CommunityVoices = () => {
  // Empty array - ready for real testimonials to be added by admin
  const testimonials: Testimonial[] = [];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Voices</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hear from our storytellers and learners about their journey with Zintsomi Academy
        </p>
      </div>

      {testimonials.length === 0 ? (
        <Card className="bg-gradient-to-br from-sky-50 to-teal-50 border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <MessageCircle className="w-16 h-16 text-sky-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Community testimonials will be featured here once they are added by our admin team.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white rounded-xl overflow-hidden relative">
              <div className="absolute top-4 right-4 text-sky-200">
                <Quote className="w-8 h-8" />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.userAvatar} />
                    <AvatarFallback className="bg-gradient-to-br from-sky-400 to-teal-500 text-white font-semibold">
                      {getInitials(testimonial.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.userName}</h4>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                </div>

                {testimonial.rating && (
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}

                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.feedback}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center py-8">
        <Card className="bg-gradient-to-br from-sky-50 to-teal-50 border-0 shadow-sm">
          <CardContent className="p-8">
            <MessageCircle className="w-12 h-12 text-sky-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Your Story</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Have a story to share about your journey with Zintsomi Academy? We'd love to hear from you!
            </p>
            <p className="text-sm text-gray-500">
              Contact our admin team to share your testimonial
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityVoices;
