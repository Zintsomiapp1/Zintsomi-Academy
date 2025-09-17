import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, X, MessageSquare } from 'lucide-react';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  prompts?: Array<{
    question: string;
    answer: string;
  }>;
}

interface SwipeableCardProps {
  profile: Profile;
  onSwipe: (liked: boolean) => void;
  onMessage?: () => void;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  profile,
  onSwipe,
  onMessage
}) => {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 100;
  const MAX_ROTATION = 15;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      onSwipe(dragOffset.x > 0);
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, dragStart, dragOffset]);

  const rotation = (dragOffset.x / window.innerWidth) * MAX_ROTATION;
  const opacity = 1 - Math.abs(dragOffset.x) / (SWIPE_THRESHOLD * 2);

  const cardStyle = {
    transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
    opacity: Math.max(opacity, 0.5),
    transition: isDragging ? 'none' : 'all 0.3s ease-out',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none' as const,
  };

  return (
    <div className="relative">
      {/* Swipe indicators */}
      {isDragging && (
        <>
          <div 
            className={`absolute top-1/2 left-4 transform -translate-y-1/2 z-10 transition-opacity duration-200 ${
              dragOffset.x > 50 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-xl shadow-lg">
              LIKE
            </div>
          </div>
          <div 
            className={`absolute top-1/2 right-4 transform -translate-y-1/2 z-10 transition-opacity duration-200 ${
              dragOffset.x < -50 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-xl shadow-lg">
              NOPE
            </div>
          </div>
        </>
      )}

      <Card 
        ref={cardRef}
        className="max-w-md mx-auto select-none"
        style={cardStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <CardHeader className="text-center pb-4">
          <Avatar className="h-32 w-32 mx-auto mb-4">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-2xl">
              {profile.full_name?.[0] || profile.username?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">
            {profile.full_name || profile.username}
          </CardTitle>
          {profile.bio && (
            <p className="text-muted-foreground mt-2">{profile.bio}</p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Profile Prompts */}
          {profile.prompts && profile.prompts.length > 0 && (
            <div className="space-y-3">
              {profile.prompts.slice(0, 3).map((prompt, index) => (
                <div key={index} className="bg-background/50 rounded-lg p-3">
                  <p className="text-sm font-medium text-primary mb-1">
                    {prompt.question}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {prompt.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 hover:bg-red-50 hover:border-red-300"
              onClick={() => onSwipe(false)}
            >
              <X className="h-6 w-6 text-red-500" />
            </Button>
            
            {onMessage && (
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16 hover:bg-blue-50 hover:border-blue-300"
                onClick={onMessage}
              >
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </Button>
            )}
            
            <Button
              size="lg"
              className="rounded-full w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
              onClick={() => onSwipe(true)}
            >
              <Heart className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};