export interface Conversation {
  key: string;
  character: 'user' | 'bot';
  value: string;
  error?: boolean;
  conversationId: string;
  type?: 'text' | 'image';
  url?: string;
  stop?: boolean;
}

export interface ConversationProps {
  data: Conversation[];
  showCheck: boolean;
  checkList: Conversation[];
  onCheckListChange: React.Dispatch<React.SetStateAction<any[]>>;
}
