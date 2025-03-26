import React from 'react';
import { Message } from '@/types/chat';

interface ChatWindowProps {
  messages: (Message & { isOwn?: boolean })[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent via-gray-900/10 to-transparent">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-lg ${
              msg.isOwn
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-bl-none'
            } animate-fade-in`}
          >
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
