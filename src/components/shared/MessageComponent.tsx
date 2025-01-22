import React from 'react';
import { Message } from '@/types/types';

interface ChatMessagesProps {
  messages: Message[];
  currentUserId?: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentUserId }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {messages.map((msg: Message) => (
        <div
          key={msg._id}
          className={`flex ${
            msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              msg.senderId === currentUserId
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm">{msg.message}</p>
            <span className="text-xs mt-1 block opacity-70">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;