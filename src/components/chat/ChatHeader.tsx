
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

const ChatHeader = () => {
  return (
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
            alt="Mjolo Logo"
            className="w-8 h-8 object-contain"
          />
        <span>Ask Khalulu the Storyteller</span>
        <MessageCircle className="w-5 h-5 text-primary" />
      </CardTitle>
    </CardHeader>
  );
};

export default ChatHeader;
