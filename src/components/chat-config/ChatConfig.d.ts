import { ChatList, ChatListKey } from '@/global';

export interface ChatConfigProps {
  chat: ChatList;
  parentChat?: ChatList;
  onConfirm: (chatId: string, key: ChatListKey, value: any) => void;
  onClose: () => void;
}

export interface SystemMessageProps {
  data: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface SystemMessageItemProps {
  id: string;
  value: string;
  onChange: (id: string, value: string) => void;
  onDelete: (id: string) => void;
}

export interface SmList {
  id: string;
  value: string;
}
