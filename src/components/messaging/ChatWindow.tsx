import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  onBack: () => void;
}

const ChatWindow = ({ receiverId, receiverName, receiverAvatar, onBack }: ChatWindowProps) => {
  const { user } = useAuth();
  const {
    messages,
    loading,
    isTyping,
    userPresence,
    sendMessage,
    updateTypingStatus,
    markAsRead
  } = useMessaging(receiverId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Mark unread messages as read
  useEffect(() => {
    const unreadMessages = messages
      .filter(msg => msg.receiver_id === user?.id && !msg.read_at)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
    }
  }, [messages, user?.id, markAsRead]);

  const isReceiverOnline = userPresence[receiverId]?.is_online || false;
  const isReceiverTyping = userPresence[receiverId]?.currently_typing_to === user?.id;

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleTypingChange = (typing: boolean) => {
    updateTypingStatus(typing);
  };

  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mjolo-pink mx-auto mb-2"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-row items-center space-y-0 pb-3 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-2 p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage src={receiverAvatar} />
          <AvatarFallback className="bg-mjolo-pink/20 text-mjolo-pink">
            {receiverName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <CardTitle className="text-lg">{receiverName}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                isReceiverOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className={`text-xs font-medium ${
                isReceiverOnline ? 'text-green-600' : 'text-gray-500'
              }`}>
                {isReceiverOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Typing indicator in header */}
            {isReceiverTyping && (
              <span className="text-xs text-mjolo-pink font-medium italic animate-pulse">
                typing...
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-1">
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user?.id;
              const showAvatar = index === 0 || 
                messages[index - 1]?.sender_id !== message.sender_id;
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  showAvatar={showAvatar}
                />
              );
            })}
            
            {isReceiverTyping && <TypingIndicator userName={receiverName} userAvatar={receiverAvatar} />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <MessageInput
          onSendMessage={handleSendMessage}
          onTypingChange={handleTypingChange}
        />
      </CardContent>
    </Card>
  );
};

export default ChatWindow;