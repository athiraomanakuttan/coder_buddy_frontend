'use client'
import React, { useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';

const ChatInterface = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  
  // Sample chat data
  const [chats] = useState([
    { id: 1, name: 'John Doe', messages: [
      { id: 1, text: 'Hey there!', sent: false },
      { id: 2, text: 'Hi! How are you?', sent: true }
    ]},
    { id: 2, name: 'Jane Smith', messages: [
      { id: 1, text: 'Good morning', sent: false },
      { id: 2, text: 'Morning!', sent: true }
    ]}
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    // Here you would typically handle sending the message
    setMessage('');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 p-4 flex items-center border-b">
        <button 
          className="p-2 hover:bg-gray-200 rounded-full"
          onClick={() => setSelectedChat(null)}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="ml-4 font-semibold">
          {selectedChat ? selectedChat.name : 'Chats'}
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <div className={`w-full md:w-64 border-r bg-white ${
          selectedChat ? 'hidden md:block' : 'block'
        }`}>
          {chats.map(chat => (
            <div
              key={chat.id}
              className="p-4 hover:bg-gray-100 cursor-pointer border-b"
              onClick={() => setSelectedChat(chat)}
            >
              <h3 className="font-medium">{chat.name}</h3>
              <p className="text-sm text-gray-500 truncate">
                {chat.messages[chat.messages.length - 1].text}
              </p>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedChat.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.sent ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      msg.sent
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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