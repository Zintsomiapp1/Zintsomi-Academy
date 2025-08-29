import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserMessage } from '@/hooks/useMessaging';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: UserMessage;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

const MessageBubble = ({ message, isOwnMessage, showAvatar = true }: MessageBubbleProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwnMessage && showAvatar && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={message.sender?.avatar_url} />
          <AvatarFallback className="bg-mjolo-pink/20 text-mjolo-pink text-xs">
            {message.sender?.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${isOwnMessage ? 'order-first' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-gradient-to-r from-mjolo-pink to-mjolo-purple text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        
        <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">
            {formatTime(message.created_at)}
          </span>
          {isOwnMessage && (
            <div className="text-gray-500">
              {message.read_at ? (
                <CheckCheck className="w-3 h-3 text-blue-500" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>
      
      {isOwnMessage && showAvatar && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={message.sender?.avatar_url} />
          <AvatarFallback className="bg-mjolo-purple/20 text-mjolo-purple text-xs">
            {message.sender?.full_name?.charAt(0) || 'Y'}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;