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
    onCallEnd?: () => void;
}