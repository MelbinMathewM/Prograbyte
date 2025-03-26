import React from 'react';
import { MutualFollower } from '@/types/chat';

interface ChatSidebarProps {
  conversations: MutualFollower[];
  selectConversation: (user: MutualFollower) => void;
  active?: string;
  isDark: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  selectConversation,
  active,
  isDark,
}) => {
  return (
    <div
      className={`w-1/4 border-r ${
        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
      } p-4 flex flex-col`}
    >
      <h2 className="text-2xl font-semibold mb-6">Chats</h2>
      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
        {conversations.map((user) => (
          <div
            key={user._id}
            onClick={() => selectConversation(user)}
            className={`flex items-center space-x-4 cursor-pointer p-3 rounded-xl transition ${
              active === user._id
                ? 'bg-blue-600 text-white shadow-lg'
                : isDark
                ? 'hover:bg-gray-800'
                : 'hover:bg-gray-100'
            }`}
          >
            {/* Optional Avatar */}
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}`}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            <span className="font-medium">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
