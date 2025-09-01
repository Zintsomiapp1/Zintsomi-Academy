import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  userName?: string;
  userAvatar?: string;
}

const TypingIndicator = ({ userName = "Someone", userAvatar }: TypingIndicatorProps) => {
  return (
    <div className="flex items-start gap-2 p-2">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-mjolo-pink/20 text-mjolo-pink text-xs">
          {userName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600 mr-2">{userName} is typing</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;