import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MessageSquare, X } from 'lucide-react';
import { useVideoCall } from './useVideoCall';
import { VideoCallProps } from './types';
import { useRouter } from 'next/navigation';
import { updateMeetingStatus } from '@/app/services/shared/meetingApi';

const VideoCallUI: React.FC<VideoCallProps> = ({ roomId,meetingId, onCallEnd }) => {
    const {
        localVideoRef,
        remoteVideoRef,
        isConnected,
        isVideoEnabled,
        isAudioEnabled,
        isScreenSharing,
        toggleVideo,
        toggleAudio,
        startScreenShare,
        stopScreenShare,
        endCall,
        messages,
        sendMessage
    } = useVideoCall(roomId, onCallEnd);

    const [isLocalVideoLarge, setIsLocalVideoLarge] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);

    const isAdmin = localStorage.getItem("isAdmin") || "";
    const isExpert = localStorage.getItem("isExpert") || ""
    const currentMeetingDetails = localStorage.getItem("currentMeeting") || "";
    const token = localStorage.getItem("userAccessToken") || ""
    const router = useRouter();

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const handleEndCall = async (endMeeting: boolean) => {
        setIsModalOpen(false);
        
        if (endMeeting && meetingId) {
            await updateMeetingStatus(token,1,meetingId);
        }

        endCall();

        if (isAdmin) {

            if (!currentMeetingDetails) {
                router.push("/admin/meeting/meetingList");
            } else {
        const meetingDetails = JSON.parse(currentMeetingDetails);

                router.push(`/admin/expertApproval/${meetingDetails.userId}/${meetingDetails.meetingId}`);
            }
        } else if (isExpert) {
            router.push("/expert/dashboard");
        } else {
            router.push("/dashboard");
        }
    };

    const toggleVideoSize = () => {
        if (!isScreenSharing) {
            setIsLocalVideoLarge(!isLocalVideoLarge);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage.trim());
            setNewMessage('');
        }
    };
console.log("isModalOpen",isModalOpen)
    return (
        <div className="flex h-screen bg-gray-900">

{isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center transform scale-95 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">Do you want to end or leave the meeting?</h2>
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => handleEndCall(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    End Meeting
                </button>
                <button
                    onClick={() => handleEndCall(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Leave Meeting
                </button>
            </div>
        </div>
    </div>
)}

        
            {/* Main Video Container */}
            <div className={`${isChatOpen ? 'flex-1' : 'w-full'} relative`}>
                {/* Primary Video */}
                <video
                    ref={isLocalVideoLarge ? localVideoRef : remoteVideoRef}
                    autoPlay
                    playsInline
                    muted={isLocalVideoLarge}
                    className="w-full h-full object-contain bg-black"
                />

                {/* PiP Video Container */}
                {!isScreenSharing && (
                    <div 
                        onClick={toggleVideoSize}
                        className="absolute top-4 right-4 w-64 h-48 cursor-pointer overflow-hidden rounded-lg shadow-lg border-2 border-white"
                    >
                        <video
                            ref={isLocalVideoLarge ? remoteVideoRef : localVideoRef}
                            autoPlay
                            playsInline
                            muted={!isLocalVideoLarge}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Screen Share Indicator */}
                {isScreenSharing && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-lg text-white">
                        Screen Sharing Active
                    </div>
                )}

                {/* Connection Status */}
                <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                    {!isConnected ? (
                        <p>Waiting for another participant...</p>
                    ) : (
                        <p className="text-green-500">Connected</p>
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black bg-opacity-50 p-4 rounded-full">
                    <button
                        onClick={toggleVideo}
                        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                        title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                    >
                        {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>
                    <button
                        onClick={toggleAudio}
                        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                        title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
                    >
                        {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>
                    <button
                        onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                        className={`p-3 rounded-full ${
                            isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                        } text-white`}
                        title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
                    >
                        <Monitor size={24} />
                    </button>
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`p-3 rounded-full ${
                            isChatOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                        } text-white`}
                        title={isChatOpen ? "Close chat" : "Open chat"}
                    >
                        <MessageSquare size={24} />
                    </button>
                    <button
                        onClick={()=>setIsModalOpen(true)}
                        className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white"
                        title="End call"
                    >
                        <PhoneOff size={24} />
                    </button>
                </div>
            </div>

            {/* Chat Sidebar */}
            {isChatOpen && (
                <div className="w-96 bg-gray-800 flex flex-col">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="text-white text-lg font-semibold">Chat</h2>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="text-gray-400 hover:text-white"
                            title="Close chat"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                    {/* Messages */}
                    <div 
                        ref={chatRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                    >
                        {messages.map((message, index) => (
                            <div
                                key={`${message.timestamp}-${index}`}
                                className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                        message.isSelf
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-white'
                                    }`}
                                >
                                    <div className="break-words">{message.text}</div>
                                    <div className="text-xs opacity-75 mt-1">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className={`px-4 py-2 rounded-lg ${
                                    newMessage.trim() 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                    
                </div>
            )}

            
        </div>
    );
};

export default VideoCallUI;