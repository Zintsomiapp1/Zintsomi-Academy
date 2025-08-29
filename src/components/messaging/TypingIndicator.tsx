import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-gray-100 rounded-2xl px-4 py-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
      <span className="text-xs text-gray-500">typing...</span>
    </div>
  );
};

export default TypingIndicator;