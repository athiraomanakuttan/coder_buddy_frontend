'use client'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChevronLeft, Send ,Link, FileVideo2  } from 'lucide-react';
import { getConversationList, getUserChat, newMessage } from '@/app/services/shared/ChatApi';
import {ChatListItem, formDataType, MeetingDataType, Message} from '@/types/types'
import conversationStore from '@/store/conversationStore'
import MesssageComponent from '@/components/shared/MessageComponent'
import { SocketContext } from '@/Context/SocketContext';
import PaymentLinkComponent from '@/components/expert/paymentLink/paymentLinkComponent';
import { paymentValidation } from '@/app/utils/validation';
import { toast } from 'react-toastify';
import {paymentCreation} from '@/app/services/expert/paymentApi'
import MeetingLinkComponent from '@/components/expert/meetingLink/meetingLinkComponent';
import { createMeeting } from '@/app/services/shared/meetingApi';
import {formatDate, formatTime} from '@/app/utils/dateUtils'

const ChatInterface = () => {
  const { socket } = useContext(SocketContext);
  const { selectedConversation, setSelectedConversation } = conversationStore();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [participentId,setParticipentId]=useState<string | null>(null)
  const [showModal,setShowModal]=useState<boolean>(false)
  const [showMeetingModel, setShowMeetingModel]= useState<boolean>(false)
  const [selectedPostId, setSelectedPostId]= useState<string | null>(null)
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("userAccessToken") as string;
  const isExpert = localStorage.getItem("isExpert") as string || false;
  const userString = localStorage.getItem("user") as string;
  
  const user = JSON.parse(userString);


  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        if (!token) {
          throw new Error("No access token found");
        }
        const response = await getConversationList(token);
        console.log("response at get", response)
        setChats(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chats");
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }

    };

    fetchChats();
    return ()=> setSelectedConversation(null)
  }, []);

  useEffect(() => {
    if (socket && selectedChatId) {
      // Join the chat room
      socket.emit('join-chat', selectedChatId);
  
      const handleNewMessage = (newMessage: any) => {
        console.log('Frontend received socket message:', newMessage);
        if (newMessage.chatId === selectedChatId) {
          setChatMessages(prev => [...prev, newMessage]);
        }
      };
  
      socket.on('chat-message', handleNewMessage);
  
      return () => {
        socket.off('chat-message', handleNewMessage);
        socket.emit('leave-chat', selectedChatId);
      };
    }
  }, [socket, selectedChatId]);


  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleCreateMeeting = async (formData:MeetingDataType)=>{
    
    if(!participentId){
      toast.error("participents id is empty try again")
      return
    }
    if(!selectedPostId){
      toast.error("post id is empty try again")
      return
    }
    
    const response = await createMeeting(token, formData, participentId,selectedPostId)
    if(response.data){
      const meetingDate = formatDate(response.data.meetingDate)
      const meetingTime =  formatTime(response.data.meetingDate)
      setMessage(`I have created a meeting On ${meetingDate} at ${meetingTime}. See you there!`);
      setShowMeetingModel(false)
    }
  }

  const handleSend = async () => {
    

    if (!message.trim() || !selectedChatId) return;
  
    const selectedChat = chats.find(chat => chat.chatId === selectedChatId);
    if (!selectedChat) {
      console.error("Selected chat not found");
      return;
    }
  
    if (socket) {
      const messageData = {
        chatId: selectedChatId,
        receiverId: selectedChat.participant.id,
        senderId: user.id,
        text: message,
        timestamp: new Date()
      };
      console.log('Emitting message:', messageData);
      socket.emit('chat-message', messageData);
      setMessage('');
    }
    // Call newMessage API
    const response = await newMessage(token, selectedChat.participant.id, message, selectedChatId);
    if (response) {
      console.log("messageSent",response)
      selectedChatFn(selectedChatId);
    }
  };
  const selectedChat = chats.find(chat => chat.chatId === selectedChatId);

  useEffect(() => {
    if (selectedChat) {
      setParticipentId(selectedChat.participant.id);
    }
  }, [selectedChatId, chats]);
  
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
    const response =  await getUserChat(chatId,token);
    if(response?.data?.messages){
      {setChatMessages(response?.data?.messages)
        console.log(response)
      }
    }
     
  }

  const handleCreateMeetingLink = async (formData:formDataType)=>{
    const isValidated = paymentValidation(formData)
    if(!isValidated.status){
      toast.error(isValidated.message)
      return
    }if(!participentId){
      toast.error("participent id is empty")
      return
    }
    if(!selectedPostId){
      toast.error("No selected post")
      return
    }
    const response =  await paymentCreation(token,formData.title,formData.amount,participentId,selectedPostId)
    if(response)
    {
      console.log(response.data)
      setMessage(`I have created a payment link \n  Amount  : ₹ ${response?.data?.amount} \n Payment Id : ${response?.data?._id} \n Payment Link : ${process.env.NEXT_PUBLIC_API_URI}/payment/${response?.data?._id}/`)
      
      setShowModal(false)
    }
  }
  const changeSelectedChat = (chatId: string, postId: string)=>{
    selectedChatFn(chatId)
    setSelectedPostId(postId)
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
                onClick={()=>changeSelectedChat(chat.chatId, chat.postId)}
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
                    <p className="text-sm text-gray-500">{chat.postId}</p>
                    
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
            <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef} >
               <MesssageComponent  messages={chatMessages} currentUserId={user?.id || user?._id}  /> 
               <div ref={messageEndRef} />
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
                {
                  isExpert && 
               ( <><button className='border p-2' onClick={()=>setShowModal(true)}><Link/></button>
               <button className='border p-2' onClick={()=>setShowMeetingModel(true)}><FileVideo2/></button></>
                )}
              </div>
            </div>
          </div>


        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
        ({showModal  && <PaymentLinkComponent  showModal={showModal} setShowModal={setShowModal} handleCreateMeetingLink={handleCreateMeetingLink} /> })
        ({showMeetingModel  && <MeetingLinkComponent  showMeetingModel={showMeetingModel} setShowMeetingModel={setShowMeetingModel} handleCreateMeeting={handleCreateMeeting} /> })
      </div>
    </div>
  );
};

export default ChatInterface;