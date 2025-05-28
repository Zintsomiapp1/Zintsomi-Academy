
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ 
  size = 'md', 
  message = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gray-50 flex items-center justify-center'
    : 'flex items-center justify-center py-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
