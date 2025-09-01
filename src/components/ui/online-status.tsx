import React from 'react';
import { Circle } from 'lucide-react';

interface OnlineStatusProps {
  isOnline: boolean;
  lastSeen?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const OnlineStatus = ({ 
  isOnline, 
  lastSeen, 
  size = 'sm', 
  showText = false,
  className = ''
}: OnlineStatusProps) => {
  const formatLastSeen = (lastSeen: string) => {
    if (!lastSeen) return 'Never seen';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Active now';
    if (diffInMinutes < 60) return `Active ${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `Active ${Math.floor(diffInMinutes / 60)}h ago`;
    return `Active ${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (showText) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Circle 
          className={`${sizeClasses[size]} ${
            isOnline 
              ? 'fill-green-500 text-green-500' 
              : 'fill-gray-400 text-gray-400'
          }`} 
        />
        <span className={`${textSizeClasses[size]} ${
          isOnline ? 'text-green-600' : 'text-gray-500'
        }`}>
          {isOnline ? 'Online' : formatLastSeen(lastSeen || '')}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full ${
        isOnline ? 'bg-green-500' : 'bg-gray-400'
      } ${className}`}
      title={isOnline ? 'Online' : formatLastSeen(lastSeen || '')}
    />
  );
};

export default OnlineStatus;