export interface IceCandidateMessage {
    candidate: RTCIceCandidateInit;
}

export interface OfferMessage {
    offer: RTCSessionDescriptionInit;
    from: string;
    roomId: string;
}

export interface AnswerMessage {
    answer: RTCSessionDescriptionInit;
    from: string;
    roomId: string;
}

export interface VideoCallProps {
    roomId: string;
    onCallEnd?: () => void;
}