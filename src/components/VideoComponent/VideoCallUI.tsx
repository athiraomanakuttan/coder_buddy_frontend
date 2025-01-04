import React from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor } from 'lucide-react';
import { useVideoCall } from './useVideoCall';
import { VideoCallProps } from './types';
import { useRouter } from 'next/navigation';

const VideoCallUI: React.FC<VideoCallProps> = ({ roomId, onCallEnd }) => {
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
        endCall
    } = useVideoCall(roomId, onCallEnd);
    const isAdmin = localStorage.getItem("isAdmin") || ""
    const currentMeetingDetails = localStorage.getItem("currentMeeting") || ""
    const router = useRouter()
    
    const handleEndCall = () => {
        endCall()
        if(isAdmin) {
            if(!currentMeetingDetails)
            router.push('/admin/meeting/meetingList')
            else{
                const meetingDetails = JSON.parse(currentMeetingDetails)
                router.push(`/admin/expertApproval/${meetingDetails.userId}/${meetingDetails._id}`)
            }
        } else {
            router.push('/expert/dashboard');
        }
    }

    return (
        <div className="flex flex-col items-center p-1 bg-gray-900 min-h-screen">
            {/* Connection Status */}
            <div className="text-white mb-4">
                {!isConnected && (
                    <p className="text-lg">Waiting for another participant to join...</p>
                )}
                {isConnected && (
                    <p className="text-lg text-green-500">Connected</p>
                )}
                
            </div>
            
            {/* Video Containers */}
            <div className="flex flex-wrap justify-center gap-4 mb-4 w-full max-w-6xl">
                {/* Local Video */}
                <div className="relative flex-1 min-w-[320px]">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-96 rounded-lg object-cover bg-gray-800 shadow-lg"
                    />
                    <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-md text-sm">
                        You {isScreenSharing ? '(Screen)' : ''}
                    </div>
                    {!isVideoEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
                            <VideoOff size={48} className="text-white opacity-50" />
                        </div>
                    )}
                </div>
                
                {/* Remote Video */}
                <div className="relative flex-1 min-w-[320px]">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-96 rounded-lg object-cover bg-gray-800 shadow-lg"
                        onLoadedMetadata={() => console.log('Remote video loadedmetadata event')}
                        onPlay={() => console.log('Remote video play event')}
                        onError={(e) => console.error('Remote video error:', e)}
                    />
                    <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-md text-sm">
                        Remote User
                    </div>
                </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={toggleVideo}
                    className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                >
                    {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                </button>
                <button
                    onClick={toggleAudio}
                    className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                >
                    {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                <button
                    onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                    className={`p-3 rounded-full ${
                        isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                    } text-white`}
                >
                    <Monitor size={24} />
                </button>
                <button
                    onClick={handleEndCall}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};

export default VideoCallUI;