import { Conversation } from '@/components/conversation/Conversation';

export interface ChatProps {
  data: Conversation[];
  chatId?: string;
  title?: string;
}
