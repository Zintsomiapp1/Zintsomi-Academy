
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Upload } from 'lucide-react';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface CourseReviewsProps {
  courseId: string;
}

const CourseReviews = ({ courseId }: CourseReviewsProps) => {
  const [reviews] = useState<Review[]>([]); // Empty reviews
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  const renderStars = (rating: number, interactive = false) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer' : ''}`}
        onClick={() => interactive && setRating(i + 1)}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Reviews</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(0)}</div>
            <span className="text-lg font-semibold">0.0</span>
            <span className="text-gray-600">(0 reviews)</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="bg-gray-100 rounded-lg p-8">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No reviews yet</p>
              <p className="text-sm text-gray-500">Be the first to review this course</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <div className="flex">{renderStars(rating, true)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                placeholder="Share your thoughts about this course..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                rows={4}
              />
            </div>
            <Button className="w-full">Submit Review</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseReviews;
