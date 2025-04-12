import React, { useState, useEffect, useContext, useRef } from 'react';
import { isValid, format } from 'date-fns';
import { blogSocket } from '@/configs/socketConfig';
import { fetchConversation, fetchMutualConnections, fetchMessages } from '@/api/chat';
import { UserContext } from '@/contexts/user-context';
import { useTheme } from '@/contexts/theme-context';
import { MutualFollower, Message } from '@/types/chat';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ChatDashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<MutualFollower | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [mutualFollowers, setMutualFollowers] = useState<MutualFollower[]>([]);
  const { user } = useContext(UserContext) ?? {};
  const loggedInUserId = user?.id;
  const { theme } = useTheme();
  const isDark = theme === 'dark-theme';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMutualFollowers = async () => {
      if (!loggedInUserId) return;
      try {
        const response = await fetchMutualConnections(loggedInUserId);
        setMutualFollowers(response.users);
      } catch (error) {
        console.error('Error fetching mutual connections:', error);
      }
    };
    fetchMutualFollowers();
  }, [loggedInUserId]);

  useEffect(() => {
    if (!loggedInUserId) return;
    blogSocket.emit('join', loggedInUserId);

    blogSocket.on('receive_message', (data: Message) => {
      setMessages((prev) => [...prev, { ...data, isOwn: data.sender === loggedInUserId }]);
    });

    return () => {
      blogSocket.off('receive_message');
    };
  }, [loggedInUserId]);

  useEffect(() => {
    const fetchOrCreateConversation = async () => {
      if (!selectedUser || !loggedInUserId) return;
      try {
        const res = await fetchConversation(selectedUser._id, loggedInUserId);
        setConversationId(res.conversationId);
        const messagesRes = await fetchMessages(res.conversationId, 300);
        setMessages(
          messagesRes.messages.map((msg: Message) => ({
            ...msg,
            isOwn: msg.sender === loggedInUserId,
          }))
        );
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };
    fetchOrCreateConversation();
  }, [selectedUser, loggedInUserId]);

  const handleSendMessage = (msg: string) => {
    if (!selectedUser || !conversationId) return;
    const payload: Message = {
      conversation: conversationId,
      sender: loggedInUserId!,
      receiver: selectedUser._id,
      content: msg,
    };
    blogSocket.emit('send_message', payload);
  };

  const groupMessagesByDate = (messages: Message[]) => {
    return messages.reduce<Record<string, Message[]>>((acc, message) => {
      const createdAt = message?.createdAt;
      const dateObj = createdAt ? new Date(createdAt) : null;
      if (dateObj && isValid(dateObj)) {
        const date = format(dateObj, 'yyyy-MM-dd');
        if (!acc[date]) acc[date] = [];
        acc[date].push(message);
      } else {
        if (!acc['unknown']) acc['unknown'] = [];
        acc['unknown'].push(message);
      }
      return acc;
    }, {});
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  const [input, setInput] = useState('');

  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} p-2 sm:p-4 space-y-4`}>
      <nav className={`${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-500"} p-6 rounded mb-8 flex items-center`}>
              <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
              <ChevronRight size={16} />
              <Link to="/blog" className="font-bold hover:text-blue-500">Blog</Link>
              <ChevronRight size={16} />
              <span>Chat</span>
            </nav>
      
            {/* Blog Header */}
            <div className="flex w-full sm:mx-auto justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Chat</h2>
              <button
                onClick={() => navigate(-1)}
                className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
              >
                <ChevronLeft size={16} />
                Back
              </button>
            </div>
      <div className="flex flex-col sm:flex-row h-[80vh] rounded-xl overflow-hidden shadow-xl">
        {/* Sidebar */}
        <div className={`w-full sm:w-1/4 ${isDark ? 'bg-gray-800' : 'bg-white'} overflow-y-auto`}>
          <h2 className="text-lg font-semibold p-4 border-b">Chats</h2>
          {mutualFollowers.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-300 ${selectedUser?._id === user._id ? 'bg-gray-300' : ''
                }`}
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "User"}`}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span>{user.username}</span>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className={`flex items-center gap-4 p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser?.username || "User"}`}
                  alt={selectedUser.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.username}</h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="text-center my-2 text-sm text-gray-500">
                      {format(new Date(date), 'MMMM d, yyyy')}
                    </div>
                    {msgs.map((msg, index) => (
                      <div key={index} className={`mb-2 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                        <div className="inline-flex flex-col items-end max-w-[80%]">
                          <span
                            className={`inline-block px-4 py-2 rounded break-words ${msg.isOwn ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                              }`}
                          >
                            {msg.content}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {msg.createdAt ? format(new Date(msg.createdAt), 'hh:mm a') : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (input.trim()) {
                      handleSendMessage(input);
                      setInput('');
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`flex-1 p-2 rounded border ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-lg font-medium text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;
