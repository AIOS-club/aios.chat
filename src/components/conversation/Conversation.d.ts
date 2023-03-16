export interface Conversation {
  key: string;
  character: 'user' | 'bot';
  value: string;
  error: boolean;
  loading: boolean;
  conversationId: string;
  type?: 'text' | 'image';
  url?: string;
  stop?: boolean;
}

export interface ConversationProps {
  data: Conversation[];
}
