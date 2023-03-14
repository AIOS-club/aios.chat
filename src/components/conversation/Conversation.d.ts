export interface Conversation {
  key: string;
  character: 'user' | 'bot';
  value: string;
  error: boolean;
  loading: boolean;
  conversationId: string;
  type?: 'text' | 'image';
  url?: string;
}

export interface ConversationProps {
  data: Conversation[];
}
