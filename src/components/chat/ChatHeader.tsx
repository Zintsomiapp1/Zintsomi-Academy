
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

const ChatHeader = () => {
  return (
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center space-x-2">
        <img
          src="/lovable-uploads/531e05b9-22e5-4b83-a3f4-953ecd13ff8f.png"
          alt="Khalulu the Storyteller"
          className="w-8 h-8 object-contain"
        />
        <span>Ask Khalulu the Storyteller</span>
        <MessageCircle className="w-5 h-5 text-blue-600" />
      </CardTitle>
    </CardHeader>
  );
};

export default ChatHeader;
