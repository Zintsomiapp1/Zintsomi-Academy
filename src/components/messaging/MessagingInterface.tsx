import React, { useState } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import OnlineUsersList from './OnlineUsersList';

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
    <div className="w-full max-w-6xl mx-auto">
      {selectedConversation ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <ChatWindow
              receiverId={selectedConversation.userId}
              receiverName={selectedConversation.userName}
              receiverAvatar={selectedConversation.userAvatar}
              onBack={handleBack}
            />
          </div>
          <div className="hidden lg:block">
            <OnlineUsersList />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ConversationList onSelectConversation={handleSelectConversation} />
          </div>
          <div className="hidden lg:block">
            <OnlineUsersList />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingInterface;