import { IconProps } from '@/components/icon-picker/IconPicker';
import { ChatListKey } from '@/global';

export interface ChatConfigProps {
  chatId: string;
  originTitle?: string;
  originIcon?: IconProps;
  handleChange?: (chatId: string, key: ChatListKey, value: any) => void;
}
