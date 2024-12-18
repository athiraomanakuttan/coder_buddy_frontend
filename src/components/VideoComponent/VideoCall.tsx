'use client';

import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface IceCandidateMessage {
    candidate: RTCIceCandidateInit;
}

interface OfferMessage {
    offer: RTCSessionDescriptionInit;
    from: string;
}

interface AnswerMessage {
    answer: RTCSessionDescriptionInit;
    from: string;
}

const socket: Socket = io(process.env.NEXT_PUBLIC_API_URI); 

const VideoCall: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        const servers: RTCConfiguration = { 
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] 
        };

        // Initialize peer connection
        peerConnection.current = new RTCPeerConnection(servers);

        // Send ICE candidates to signaling server
        peerConnection.current.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { candidate: event.candidate });
            }
        };

        // Display remote stream
        peerConnection.current.ontrack = (event: RTCTrackEvent) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // Get local media
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream: MediaStream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Add local stream to peer connection
                stream.getTracks().forEach((track) => {
                    if (peerConnection.current) {
                        peerConnection.current.addTrack(track, stream);
                    }
                });

                socket.emit('offer', { to: 'peer-id' }); // Replace with signaling logic
            });

        // Handle signaling messages
        socket.on('offer', async (data: OfferMessage) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(data.offer);
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                socket.emit('answer', { answer, to: data.from });
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
            // Cleanup peer connection and streams
            peerConnection.current?.close();
            peerConnection.current = null;
        };
    }, []);

    return (
        <div>
            <h1>Video Call</h1>
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '45%' }}
            />
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: '45%' }}
            />
        </div>
    );
};

export default VideoCall;
