import { ChatListKey } from '@/global';

export interface ChatConfigProps {
  chatId: string;
  originTitle?: string;
  systemMessage?: string;
  handleChange?: (chatId: string, key: ChatListKey, value: any) => void;
}
