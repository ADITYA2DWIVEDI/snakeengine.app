export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    imageUrls?: string[];
}

export interface Conversation {
    id:string;
    title: string;
    messages: ChatMessage[];
    persona?: string;
}

export interface User {
    name: string;
    email: string;
    avatarUrl?: string;
}
