"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft, Send, Link, FileVideo2 } from "lucide-react";
import {
  getConversationList,
  getUserChat,
  newMessage,
} from "@/app/services/shared/ChatApi";
import { Message, formDataType, MeetingDataType, ChatResponseType, ChatResType, Participant, authUserType } from "@/types/types";
import conversationStore from "@/store/conversationStore";
import MesssageComponent from "@/components/shared/MessageComponent";
import { SocketContext } from "@/Context/SocketContext";
import PaymentLinkComponent from "@/components/expert/paymentLink/paymentLinkComponent";
import MeetingLinkComponent from "@/components/expert/meetingLink/meetingLinkComponent";
import { paymentValidation } from "@/app/utils/validation";
import { toast } from "react-toastify";
import { paymentCreation } from "@/app/services/expert/paymentApi";
import { createMeeting } from "@/app/services/shared/meetingApi";
import { formatDate, formatTime } from "@/app/utils/dateUtils";

const ChatInterface = () => {
  const { socket } = useContext(SocketContext);
  const {  setSelectedConversation } = conversationStore();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMeetingModel, setShowMeetingModel] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Local Storage Data
  const [token, setToken] = useState<string>("");
const [isExpert, setIsExpert] = useState<string | null>(null);
const [user, setUser] = useState<authUserType>();

  useEffect(() => {
  setToken(localStorage.getItem("userAccessToken") || "");
  setIsExpert(localStorage.getItem("isExpert"));
  const userString = localStorage.getItem("user");
  if (userString) {
    setUser(JSON.parse(userString));
  }
}, []);
console.log("token", token)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        if (!token) {
          return
        }
        const response = await getConversationList(token);
        // Transform the data to include post title
        const transformedChats = response.data.map((chat: ChatResType) => ({
          chatId: chat._id,
          participant: chat.participents.find((p: Participant) => p.id !== user?.id) || chat.participents[0],
          postId: chat.postId?._id || null,
          postTitle: chat.postId?.title || "No title",
          postDescription: chat.postId?.description || "",
          messages: chat.messages,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        }));
        setChats(transformedChats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chats");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
    return () => setSelectedConversation(null);
  }, [token]);

  useEffect(() => {
    if (socket && selectedChatId) {
      socket.emit("join-chat", selectedChatId);

      const handleNewMessage = (newMessage: Message) => {
        if (newMessage.chatId === selectedChatId) {
          setChatMessages(prev => [...prev, newMessage]);
        }
      };

      socket.on("chat-message", handleNewMessage);

      return () => {
        socket.off("chat-message", handleNewMessage);
        socket.emit("leave-chat", selectedChatId);
      };
    }
  }, [socket, selectedChatId]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    const selectedChat = chats.find(chat => chat.chatId === selectedChatId);
    if (selectedChat) {
      setParticipantId(selectedChat.participant.id);
      setSelectedPostId(selectedChat.postId);
    }
  }, [selectedChatId, chats]);

  const handleCreateMeeting = async (formData: MeetingDataType) => {
    if (!participantId || !selectedPostId) {
      toast.error("Missing required information for meeting creation");
      return;
    }

    const response = await createMeeting(token, formData, participantId, selectedPostId);
    if (response.data) {
      const meetingDate = formatDate(response.data.meetingDate);
      const meetingTime = formatTime(response.data.meetingDate);
      setMessage(`I have created a meeting On ${meetingDate} at ${meetingTime}. See you there!`);
      setShowMeetingModel(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedChatId) return;
    
    const selectedChat = chats.find(chat => chat.chatId === selectedChatId);
    if (!selectedChat) return;

    if (socket) {
      const messageData = {
        chatId: selectedChatId,
        receiverId: selectedChat.participant.id,
        senderId: user?.id,
        text: message,
        timestamp: new Date(),
      };
      socket.emit("chat-message", messageData);
    }

    const response = await newMessage(token, selectedChat.participant.id, message, selectedChatId);
    if (response) {
      setMessage("");
      await selectedChatFn(selectedChatId);
    }
  };

  const selectedChatFn = async (chatId: string) => {
    setSelectedChatId(chatId);
    setSelectedConversation(chatId);
    const response = await getUserChat(chatId, token);
    if (response?.data?.messages) {
      setChatMessages(response.data.messages);
    }
  };

  const handleCreatePaymentLink = async (formData: formDataType) => {
    const isValidated = paymentValidation(formData);
    if (!isValidated.status) {
      toast.error(isValidated.message);
      return;
    }

    if (!participantId || !selectedPostId) {
      toast.error("Missing required information for payment link");
      return;
    }

    const response = await paymentCreation(
      token,
      formData.title,
      formData.amount,
      participantId,
      selectedPostId
    );

    if (response?.data) {
      setMessage(
        `I have created a payment link\nAmount: ₹ ${response.data.amount}\nPayment Id: ${response.data._id}\nPayment Link: https://www.coderbuddy.shop/payment/${response.data._id}/`
      );
      setShowModal(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading chats...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  const selectedChat = chats.find(chat => chat.chatId === selectedChatId);
  console.log("selectedChat",selectedChat)
  
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-100 p-4 flex items-center border-b">
        <button
          className="p-2 hover:bg-gray-200 rounded-full"
          onClick={() => setSelectedChatId(null)}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        {selectedChat ? (
          <div className="ml-4">
            <h1 className="font-semibold">{selectedChat.participant.name}</h1>
            <p className="text-sm text-gray-600">{selectedChat.postTitle}</p>
          </div>
        ) : (
          <h1 className="ml-4 font-semibold">Chats</h1>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`w-full md:w-64 border-r bg-white ${selectedChatId ? "hidden md:block" : "block"}`}>
          {chats.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No chats found</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.chatId}
                className={`p-4 cursor-pointer border-b ${
                  chat.chatId === selectedChatId ? "bg-sky-200" : ""
                } hover:bg-sky-200`}
                onClick={() => selectedChatFn(chat.chatId)}
              >
                <div className="flex items-center">
                  <img
                    src={chat.participant.profile_pic || "/images/default-avatar.png"}
                    alt={chat.participant.name}
                    className="w-10 h-10 rounded-full mr-3"
                  /> 
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{chat.participant.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{chat.postTitle}</p>
                    <p className="text-xs text-gray-400">{chat.participant.role}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedChatId ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
              <MesssageComponent
                messages={chatMessages}
                currentUserId={user?.id || user?._id}
              />
              <div ref={messageEndRef} />
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
                {isExpert ? (
                  <>
                    <button className="border p-2" onClick={() => setShowModal(true)}>
                      <Link />
                    </button>
                    <button className="border p-2" onClick={() => setShowMeetingModel(true)}>
                      <FileVideo2 />
                    </button>
                  </>
                ) : <div></div>}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}

        {showModal && (
          <PaymentLinkComponent
            showModal={showModal}
            setShowModal={setShowModal}
            handleCreateMeetingLink={handleCreatePaymentLink}
          />
        )}

        {showMeetingModel && (
          <MeetingLinkComponent
            showMeetingModel={showMeetingModel}
            setShowMeetingModel={setShowMeetingModel}
            handleCreateMeeting={handleCreateMeeting}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;