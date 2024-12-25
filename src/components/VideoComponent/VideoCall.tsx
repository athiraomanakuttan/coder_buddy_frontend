'use client';

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, StopCircle } from 'lucide-react';

interface IceCandidateMessage {
    candidate: RTCIceCandidateInit;
}

interface OfferMessage {
    offer: RTCSessionDescriptionInit;
    from: string;
    roomId: string;
}

interface AnswerMessage {
    answer: RTCSessionDescriptionInit;
    from: string;
    roomId: string; 
}

interface VideoCallProps {
    roomId: string;
    onCallEnd?: () => void;
}

const socket: Socket = io(process.env.NEXT_PUBLIC_API_URI as string);

const VideoCall: React.FC<VideoCallProps> = ({ roomId, onCallEnd }) => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    
    const [isConnected, setIsConnected] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [participantCount, setParticipantCount] = useState(1);
    const [isRecording, setIsRecording] = useState(false);

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(!isVideoEnabled);
            }
        }
    };

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(!isAudioEnabled);
            }
        }
    };

    const startRecording = () => {
        if (!localStreamRef.current) return;

        const streams = [localStreamRef.current];
        if (remoteVideoRef.current?.srcObject) {
            streams.push(remoteVideoRef.current.srcObject as MediaStream);
        }

        const combinedStream = new MediaStream();
        streams.forEach(stream => {
            stream.getTracks().forEach(track => {
                combinedStream.addTrack(track);
            });
        });

        const mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: 'video/webm;codecs=vp8,opus'
        });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, {
                type: 'video/webm'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = `recording-${new Date().toISOString()}.webm`;
            a.click();
            window.URL.revokeObjectURL(url);
            recordedChunksRef.current = [];
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(1000);
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            screenStreamRef.current = screenStream;

            const videoTrack = screenStream.getVideoTracks()[0];
            const senders = peerConnection.current?.getSenders();
            const videoSender = senders?.find(sender => 
                sender.track?.kind === 'video'
            );
            
            if (videoSender) {
                await videoSender.replaceTrack(videoTrack);
            }

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = screenStream;
            }

            videoTrack.onended = () => {
                stopScreenShare();
            };

            setIsScreenSharing(true);
        } catch (error) {
            console.error('Error starting screen share:', error);
            alert('Failed to start screen sharing');
        }
    };

    const stopScreenShare = async () => {
        if (localStreamRef.current && peerConnection.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            
            const senders = peerConnection.current.getSenders();
            const videoSender = senders.find(sender => 
                sender.track?.kind === 'video'
            );
            
            if (videoSender) {
                await videoSender.replaceTrack(videoTrack);
            }

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStreamRef.current;
            }

            screenStreamRef.current?.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
            
            setIsScreenSharing(false);
        }
    };

    const endCall = () => {
        if (isRecording) {
            stopRecording();
        }
        if (isScreenSharing) {
            stopScreenShare();
        }
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        peerConnection.current?.close();
        socket.emit('leave-room', { roomId });
        onCallEnd?.();
    };

    useEffect(() => {
        const setupCall = async () => {
            try {
                const servers: RTCConfiguration = { 
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' }
                    ] 
                };

                peerConnection.current = new RTCPeerConnection(servers);

                peerConnection.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', { 
                            candidate: event.candidate,
                            roomId 
                        });
                    }
                };

                peerConnection.current.ontrack = (event) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                stream.getTracks().forEach((track) => {
                    if (peerConnection.current) {
                        peerConnection.current.addTrack(track, stream);
                    }
                });

            } catch (error) {
                console.error('Error setting up call:', error);
                alert('Failed to access camera/microphone');
            }
        };

        setupCall();
        socket.emit('join-room', { roomId });

        socket.on('room-full', () => {
            alert('Room is full. Only two participants are allowed.');
            onCallEnd?.();
        });

        socket.on('participant-count', (count: number) => {
            setParticipantCount(count);
            if (count === 2) {
                setIsConnected(true);
                startRecording();
            }
        });

        socket.on('participant-left', () => {
            setIsConnected(false);
            setParticipantCount(prev => prev - 1);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
            if (isRecording) {
                stopRecording();
            }
        });

        socket.on('offer', async (data: OfferMessage) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(data.offer);
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                socket.emit('answer', { answer, to: data.from, roomId });
            }
        });

        socket.on('answer', async (data: AnswerMessage) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(data.answer);
            }
        });

        socket.on('ice-candidate', async (data: IceCandidateMessage) => {
            if (data.candidate && peerConnection.current) {
                await peerConnection.current.addIceCandidate(data.candidate);
            }
        });

        return () => {
            endCall();
            socket.disconnect();
        };
    }, [roomId]);

    return (
        <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen">
            <div className="text-white mb-4">
                {!isConnected && <p>Waiting for another participant to join...</p>}
                {isConnected && <p>Connected</p>}
                {isRecording && (
                    <div className="flex items-center gap-2 text-red-500">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        Recording
                    </div>
                )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-4">
                <div className="relative">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-96 h-72 rounded-lg object-cover bg-gray-800"
                    />
                    <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
                        You {isScreenSharing ? '(Screen)' : ''}
                    </p>
                </div>
                
                <div className="relative">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-96 h-72 rounded-lg object-cover bg-gray-800"
                    />
                    <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
                        Remote User
                    </p>
                </div>
            </div>

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
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-3 rounded-full ${
                        isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                    } text-white`}
                >
                    <StopCircle size={24} />
                </button>
                <button
                    onClick={endCall}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};

export default VideoCall;