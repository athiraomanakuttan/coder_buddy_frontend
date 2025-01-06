import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IceCandidateMessage, OfferMessage, AnswerMessage, Message, MessageEvent, ChatMessageEvent } from './types';

export const useVideoCall = (roomId: string, onCallEnd?: () => void) => {
    const socketRef = useRef<Socket | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);
    
    const [isConnected, setIsConnected] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [participantCount, setParticipantCount] = useState(1);
    const [messages, setMessages] = useState<Message[]>([]);

    const handleIceCandidate = async (candidate: RTCIceCandidate) => {
        try {
            const pc = peerConnection.current;
            if (!pc) return;

            if (pc.remoteDescription && pc.remoteDescription.type) {
                await pc.addIceCandidate(candidate);
            } else {
                console.log('Storing ICE candidate for later');
                pendingCandidatesRef.current.push(candidate);
            }
        } catch (error) {
            console.error('Error handling ICE candidate:', error);
        }
    };
    const sendMessage = (text: string) => {
        const socket = socketRef.current;
        const senderId = socket?.id;
        
        if (!socket || !senderId || !text.trim()) {
            return;
        }
        const timestamp = Date.now();
    
        const messageData: ChatMessageEvent = {
            text: text.trim(),
            roomId,
            from: senderId,
            timestamp
        };
    
        socket.emit('chat-message', messageData);
        // Remove the local state update since the message will be handled
        // by the chat-message event listener
    };

    const handleRemoteStream = async (stream: MediaStream) => {
        if (!remoteVideoRef.current) return;
        
        try {
            remoteVideoRef.current.srcObject = stream;
            
            await new Promise((resolve) => {
                if (!remoteVideoRef.current) return;
                
                remoteVideoRef.current.onloadedmetadata = () => {
                    console.log('Remote video metadata loaded');
                    resolve(true);
                };
            });

            const attemptPlay = async (attempts = 3) => {
                try {
                    if (!remoteVideoRef.current) return;
                    await remoteVideoRef.current.play();
                    console.log('Remote video started playing');
                } catch (error) {
                    if (error instanceof Error) {
                        console.warn(`Play attempt failed: ${error.message}`);
                        if (attempts > 0 && remoteVideoRef.current) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await attemptPlay(attempts - 1);
                        } else {
                            console.error('Failed to auto-play after all attempts');
                        }
                    }
                }
            };

            await attemptPlay();
        } catch (error) {
            console.error('Error handling remote stream:', error);
        }
    };

    const processPendingCandidates = async () => {
        const pc = peerConnection.current;
        if (!pc || !pc.remoteDescription) return;

        console.log(`Processing ${pendingCandidatesRef.current.length} pending candidates`);
        
        try {
            for (const candidate of pendingCandidatesRef.current) {
                await pc.addIceCandidate(candidate);
            }
            pendingCandidatesRef.current = [];
        } catch (error) {
            console.error('Error processing pending candidates:', error);
        }
    };

    const setupPeerConnection = async () => {
        const servers: RTCConfiguration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
    
        peerConnection.current = new RTCPeerConnection(servers);
    
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
    
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                try {
                    await localVideoRef.current.play();
                } catch (error) {
                    console.warn('Local video autoplay failed:', error);
                }
            }
    
            stream.getTracks().forEach((track) => {
                if (peerConnection.current) {
                    console.log('Adding track:', track.kind);
                    peerConnection.current.addTrack(track, stream);
                }
            });
    
            peerConnection.current.ontrack = async (event) => {
                console.log('Received remote track:', event.streams[0]);
                if (remoteVideoRef.current && event.streams[0]) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                    
                    try {
                        await new Promise((resolve) => {
                            if (!remoteVideoRef.current) return;
                            remoteVideoRef.current.onloadedmetadata = () => {
                                console.log('Remote video metadata loaded');
                                resolve(true);
                            };
                        });
    
                        let attempts = 3;
                        while (attempts > 0) {
                            try {
                                await remoteVideoRef.current.play();
                                console.log('Remote video started playing');
                                break;
                            } catch (error) {
                                attempts--;
                                if (attempts === 0) {
                                    console.error('Failed to play remote video after all attempts');
                                    break;
                                }
                                console.warn(`Play attempt failed, retrying... (${attempts} attempts left)`);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    } catch (error) {
                        console.error('Error setting up remote video:', error);
                    }
                }
            };
    
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    };
    

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });
    
            // Save the screen stream reference
            screenStreamRef.current = screenStream;
    
            // Get the screen video track
            const screenVideoTrack = screenStream.getVideoTracks()[0];
    
            // Add track ended listener
            screenVideoTrack.onended = () => {
                stopScreenShare();
            };
    
            // Find and replace the video sender track
            const senders = peerConnection.current?.getSenders();
            const videoSender = senders?.find(sender => 
                sender.track?.kind === 'video'
            );
            
            if (videoSender) {
                await videoSender.replaceTrack(screenVideoTrack);
            }
    
            // Update local video display
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = screenStream;
            }
    
            setIsScreenSharing(true);
    
            // Add cleanup listener
            screenVideoTrack.addEventListener('ended', () => {
                stopScreenShare();
            });
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

    const endCall = () => {
       
        if (isScreenSharing) {
            stopScreenShare();
        }
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        peerConnection.current?.close();
        socketRef.current?.emit('leave-room', { roomId });
        setIsConnected(false);
        onCallEnd?.();
    };

    useEffect(() => {
        socketRef.current = io(process.env.NEXT_PUBLIC_API_URI as string, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        
        const socket = socketRef.current;

        socket.on('chat-message', (data: ChatMessageEvent) => {
            console.log('Received chat message:', data);
            // Add received message to local state
            const receivedMessage: Message = {
                text: data.text,
                isSelf: false,
                timestamp: data.timestamp,
                senderId: data.from
            };
            setMessages(prev => [...prev, receivedMessage]);
        });

        const initializeConnection = async () => {
            try {
                await setupPeerConnection();

                if (peerConnection.current) {
                    peerConnection.current.onicecandidate = (event) => {
                        if (event.candidate) {
                            socket.emit('ice-candidate', {
                                candidate: event.candidate,
                                roomId,
                                from: socket.id
                            });
                        }
                    };

                    peerConnection.current.ontrack = (event) => {
                        console.log('Received remote track:', event.streams[0]);
                        console.log('Track kind:', event.track.kind);
                        console.log('Track enabled:', event.track.enabled);
                        console.log('Track readyState:', event.track.readyState);
                        if (remoteVideoRef.current && event.streams[0]) {
                            console.log('Setting remote video source');
                            remoteVideoRef.current.srcObject = event.streams[0];
                            
                            remoteVideoRef.current.onloadedmetadata = () => {
                                console.log('Remote video metadata loaded');
                            };
                            remoteVideoRef.current.onplay = () => {
                                console.log('Remote video started playing');
                            };
                            remoteVideoRef.current?.play().catch(e => console.error('Error auto-playing:', e));
                        }
                    };

                    peerConnection.current.oniceconnectionstatechange = () => {
                        console.log('ICE Connection State:', peerConnection.current?.iceConnectionState);
                        console.log('Connection State:', peerConnection.current?.connectionState);
                        console.log('Signaling State:', peerConnection.current?.signalingState);
                    };
                    peerConnection.current.onconnectionstatechange = () => {
                        console.log('ICE Connection State:', peerConnection.current?.iceConnectionState);
                        if (peerConnection.current?.connectionState === 'failed') {
                            console.log('Peer connection failed, attempting to reconnect...');
                            socket.emit('join-room', { roomId });
                        }
                    };
                }
            } catch (error) {
                console.error('Error setting up connection:', error);
                alert('Failed to access camera/microphone');
            }
        };

        socket.on('connect', async () => {
            console.log('Socket connected, initializing connection...');
            await initializeConnection();
            console.log('Connection initialized, joining room...');
            socket.emit('join-room', { roomId }); 
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
        });

        socket.on('room-full', () => {
            alert('Room is full. Only two participants are allowed.');
            onCallEnd?.();
        });

        socket.on('participant-count', async (count: number) => {
            console.log('Participant count:', count);
            setParticipantCount(count);
            if (count === 2) {
                setIsConnected(true);
                

                try {
                    if (peerConnection.current && 
                        peerConnection.current.signalingState === 'stable' &&
                        !peerConnection.current.currentLocalDescription) {
                        console.log('Creating initial offer...');
                        const offer = await peerConnection.current.createOffer();
                        await peerConnection.current.setLocalDescription(offer);
                        socket.emit('offer', { 
                            offer,
                            roomId,
                            from: socket.id
                        });
                    }
                } catch (error) {
                    console.error('Error creating offer:', error);
                }
            }
        });

        socket.on('participant-left', () => {
            setIsConnected(false);
            setParticipantCount(prev => prev - 1);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
            
        });

        socket.on('ice-candidate', async (data: IceCandidateMessage) => {
            if (data.candidate && peerConnection.current && data?.from !== socket.id) {
                await handleIceCandidate(new RTCIceCandidate(data.candidate));
            }
        });

        socket.on('offer', async (data: OfferMessage) => {
            if (!peerConnection.current || data.from === socket.id) return;
            
            try {
                const pc = peerConnection.current;
                
                if (pc.signalingState !== "stable") {
                    if (data.from > socket.id!) {
                        await Promise.all([
                            pc.setLocalDescription({type: "rollback"}),
                            pc.setRemoteDescription(new RTCSessionDescription(data.offer))
                        ]);
                    } else {
                        return;
                    }
                } else {
                    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                }
                
                await processPendingCandidates();
                
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                
                socket.emit('answer', { 
                    answer,
                    to: data.from,
                    roomId,
                    from: socket.id
                });
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        });

        socket.on('answer', async (data: AnswerMessage) => {
            try {
                if (peerConnection.current && 
                    peerConnection.current.signalingState === 'have-local-offer') {
                    await peerConnection.current.setRemoteDescription(
                        new RTCSessionDescription(data.answer)
                    );
                    
                    await processPendingCandidates();
                }
            } catch (error) {
                console.error('Error handling answer:', error); 
            }
        });

        return () => {
            if (socket) {
                socket.off('chat-message');
                endCall();
                socket.disconnect();
            }

        };
    }, [roomId]);

    return {
        localVideoRef,
        remoteVideoRef,
        isConnected,
        isVideoEnabled,
        isAudioEnabled,
        isScreenSharing,
        participantCount,
        messages,
        toggleVideo,
        toggleAudio,
        startScreenShare,
        stopScreenShare,
        endCall,
        sendMessage
    };
};