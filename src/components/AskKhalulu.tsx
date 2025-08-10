
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import { useChat } from '@/hooks/useChat';

const AskKhalulu = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    handleSendMessage,
    handleKeyPress,
    user,
    session
  } = useChat();

  // Show login message if user is not authenticated
  if (!user || !session) {
    return (
      <Card className="w-full max-w-2xl mx-auto h-96">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <img
            src="/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png"
            alt="Mjolo logo"
            className="w-16 h-16 object-contain mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Please Sign In</h3>
          <p className="text-gray-600 text-center">
            You need to be logged in to chat with Khalulu the Storyteller, your AI learning companion.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-96">
      <ChatHeader />
      <CardContent className="p-0 flex flex-col h-80">
        <ChatMessages messages={messages} isTyping={isTyping} />
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          disabled={isTyping}
        />
      </CardContent>
    </Card>
  );
};

export default AskKhalulu;
