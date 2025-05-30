
import React from 'react';

interface KhaluluOwlProps {
  message?: string;
  userName?: string;
  className?: string;
}

const KhaluluOwl = ({ message, userName, className = "" }: KhaluluOwlProps) => {
  const defaultMessage = userName 
    ? `Hello ${userName}! Welcome to Zintsomi College. How can I help you?`
    : "Welcome to Zintsomi College! Join us to start your learning journey.";

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Owl Avatar */}
      <div className="relative">
        <img
          src="/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png"
          alt="Khalulu the storyteller"
          className="w-24 h-24 object-contain animate-bounce"
        />
      </div>
      
      {/* Speech Bubble */}
      <div className="relative bg-white rounded-2xl p-4 shadow-lg max-w-sm">
        <p className="text-gray-700 text-center font-medium">
          {message || defaultMessage}
        </p>
        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
      </div>
    </div>
  );
};

export default KhaluluOwl;
