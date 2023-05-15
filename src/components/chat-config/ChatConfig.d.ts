import { ChatList, ChatListKey } from '@/global';

export interface ChatConfigProps {
  chat: ChatList;
  onConfirm: (chatId: string, key: ChatListKey, value: any) => void;
}
