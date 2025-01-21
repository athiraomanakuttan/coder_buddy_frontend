'use client'
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { getConversationList } from '@/app/services/shared/ChatApi';
import {ChatListItem} from '@/types/types'
import conversationStore from '@/store/conversationStore'
const ChatInterface = () => {

  const { selectedConversation, setSelectedConversation} = conversationStore()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userAccessToken");
        if (!token) {
          throw new Error("No access token found");
        }
        const response = await getConversationList(token);
        setChats(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chats");
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleSend = () => {
    if (!message.trim() || !selectedChatId) return;
    // TODO: Implement sending message functionality
    setMessage('');
  };

  const selectedChat = chats.find(chat => chat.chatId === selectedChatId);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading chats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }
  const selectedChatFn = async (chatId : string)=>{
    setSelectedChatId(chatId),
    setSelectedConversation(chatId)
  }
  

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 p-4 flex items-center border-b">
        <button 
          className="p-2 hover:bg-gray-200 rounded-full"
          onClick={() => setSelectedChatId(null)}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="ml-4 font-semibold">
          {selectedChat ? selectedChat.participant.name : 'Chats'}
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <div className={`w-full md:w-64 border-r bg-white ${
          selectedChatId ? 'hidden md:block' : 'block'
        }`}>
          {chats.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No chats found</div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.chatId}
                className={`p-4  cursor-pointer border-b  ${selectedChatId ? "bg-sky-200" : "" } hover:bg-sky-200`}
                onClick={()=>selectedChatFn(chat.chatId)}
              >
                <div className="flex items-center">
                  {chat.participant.profile_pic && (
                    <img 
                      src={chat.participant.profile_pic} 
                      alt={chat.participant.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{chat.participant.name}</h3>
                    <p className="text-sm text-gray-500">{chat.participant.role}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Area */}
        {selectedChatId ? (
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* TODO: Implement message display logic */}
              <div className="text-center text-gray-500">
                Messages will appear here
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;