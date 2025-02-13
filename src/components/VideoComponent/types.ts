export interface IceCandidateMessage {
    candidate: RTCIceCandidate;
    from: string;  // Adding the missing 'from' property
    roomId: string;
}

export interface OfferMessage {
    offer: RTCSessionDescriptionInit;
    from: string;
    roomId: string;
}

export interface AnswerMessage {
    answer: RTCSessionDescriptionInit;
    from: string;
    to: string;
    roomId: string;
}

export interface VideoCallProps {
    roomId: string;
    meetingId?:string;
    onCallEnd?: () => void;
}

export interface Message {
    text: string;
    isSelf: boolean;
    timestamp: number;
    senderId: string;
}

 export interface MessageEvent {
    text: string;
    from: string;
    roomId: string;
    timestamp: number;
}

export interface ChatMessageEvent {
    text: string;
    from: string;
    roomId: string;
    timestamp: number;
}