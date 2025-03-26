import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  isDark: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isDark }) => {
  const [message, setMessage] = useState<string>('');

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  return (
    <div
      className={`sticky bottom-0 p-4 border-t ${
        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
      } flex items-center space-x-4 backdrop-blur-md`}
    >
      <input
        type="text"
        placeholder="Type a message..."
        className={`flex-1 p-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDark
            ? 'border-gray-600 bg-gray-800 text-gray-200'
            : 'border-gray-300 bg-gray-100 text-gray-900'
        }`}
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition hover:scale-105 active:scale-95"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
