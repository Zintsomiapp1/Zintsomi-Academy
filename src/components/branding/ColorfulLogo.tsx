
import React from 'react';

const ColorfulLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-6 h-8',
    md: 'w-8 h-10',
    lg: 'w-12 h-16'
  };

  const blockHeight = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2'
  };

  return (
    <div className={`${sizeClasses[size]} flex flex-col justify-between`}>
      <div className={`w-full ${blockHeight[size]} bg-orange-500 rounded-sm`}></div>
      <div className={`w-full ${blockHeight[size]} bg-red-500 rounded-sm`}></div>
      <div className={`w-full ${blockHeight[size]} bg-green-500 rounded-sm`}></div>
      <div className={`w-full ${blockHeight[size]} bg-yellow-400 rounded-sm`}></div>
      <div className={`w-full ${blockHeight[size]} bg-blue-500 rounded-sm`}></div>
      <div className={`w-full ${blockHeight[size]} bg-green-400 rounded-sm`}></div>
      <div className={`w-full ${blockHeight[size]} bg-gray-700 rounded-sm`}></div>
    </div>
  );
};

export default ColorfulLogo;
