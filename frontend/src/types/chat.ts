export interface Message {
    _id?: string;
    conversation: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt?: string;
    isOwn?: boolean;
}

export interface MutualFollower {
    _id: string;
    username: string;
}