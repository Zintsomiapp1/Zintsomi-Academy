
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

const ChatHeader = () => {
  return (
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center space-x-2">
        <img
          src="/lovable-uploads/e153d080-0e68-4853-b008-897623780941.png"
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
