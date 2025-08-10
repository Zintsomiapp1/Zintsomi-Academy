
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
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gradient-to-br from-red-200 via-red-300 to-red-400 flex items-center justify-center px-4'
    : 'flex items-center justify-center py-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {fullScreen && (
          <img
            src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
            alt="Mjolo logo"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-4 animate-bounce"
          />
        )}
        <div className={`animate-spin rounded-full border-2 border-transparent border-t-white border-r-white mx-auto mb-3 ${sizeClasses[size]} ${fullScreen ? 'border-t-white border-r-white' : 'border-t-red-600 border-r-red-600'}`}></div>
        <p className={`font-medium ${fullScreen ? 'text-white text-sm sm:text-base' : 'text-gray-600 text-sm'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
