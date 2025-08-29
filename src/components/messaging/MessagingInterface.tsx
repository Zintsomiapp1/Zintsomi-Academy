import React, { useState } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

const MessagingInterface = () => {
  const [selectedConversation, setSelectedConversation] = useState<{
    userId: string;
    userName: string;
    userAvatar?: string;
  } | null>(null);

  const handleSelectConversation = (userId: string, userName: string, userAvatar?: string) => {
    setSelectedConversation({ userId, userName, userAvatar });
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {selectedConversation ? (
        <ChatWindow
          receiverId={selectedConversation.userId}
          receiverName={selectedConversation.userName}
          receiverAvatar={selectedConversation.userAvatar}
          onBack={handleBack}
        />
      ) : (
        <ConversationList onSelectConversation={handleSelectConversation} />
      )}
    </div>
  );
};

export default MessagingInterface;