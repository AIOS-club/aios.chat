import { IconProps } from '@/components/icon-picker/IconPicker';
import { ChatListKey } from '@/global';

export interface ChatConfigProps {
  chatId: string;
  originTitle?: string;
  originIcon?: IconProps;
  systemMessage?: string;
  handleChange?: (chatId: string, key: ChatListKey, value: any) => void;
}
