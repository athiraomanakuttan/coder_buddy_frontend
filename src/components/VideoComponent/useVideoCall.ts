import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IceCandidateMessage, OfferMessage, AnswerMessage } from './types';

export const useVideoCall = (roomId: string, onCallEnd?: () => void) => {
    const socketRef = useRef<Socket | null>(null);
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
            }

            stream.getTracks().forEach((track) => {
                if (peerConnection.current) {
                    peerConnection.current.addTrack(track, stream);
                }
            });

            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
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
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
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
        if (isRecording) {
            stopRecording();
        }
        if (isScreenSharing) {
            stopScreenShare();
        }
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        peerConnection.current?.close();
        socketRef.current?.emit('leave-room', { roomId });
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

        const initializeConnection = async () => {
            try {
                await setupPeerConnection();

                if (peerConnection.current) {
                    peerConnection.current.onicecandidate = (event) => {
                        if (event.candidate) {
                            socket.emit('ice-candidate', {
                                candidate: event.candidate,
                                roomId
                            });
                        }
                    };

                    peerConnection.current.ontrack = (event) => {
                        console.log('Received remote track:', event.streams[0]);
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = event.streams[0];
                        }
                    };
                }
            } catch (error) {
                console.error('Error setting up connection:', error);
                alert('Failed to access camera/microphone');
            }
        };

        socket.on('connect', () => {
            console.log('Connected to socket server:', socket.id);
            socket.emit('join-room', { roomId });
            initializeConnection();
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
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
                    if (peerConnection.current) {
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

        socket.on('ice-candidate', async (data: IceCandidateMessage) => {
            try {
                if (data.candidate && peerConnection.current) {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        });

        socket.on('offer', async (data: OfferMessage) => {

            if (!peerConnection.current) return;
            
            try {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                console.log("answer",answer)
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
                if (peerConnection.current) {
                    await peerConnection.current.setRemoteDescription(
                        new RTCSessionDescription(data.answer)
                    );
                }
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        });

        return () => {
            endCall();
            if (socket) {
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
        isRecording,
        participantCount,
        toggleVideo,
        toggleAudio,
        startScreenShare,
        stopScreenShare,
        startRecording,
        stopRecording,
        endCall
    };
};
