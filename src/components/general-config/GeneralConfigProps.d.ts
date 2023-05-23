import { ChatList } from '@/global';

export interface GeneralConfigProps {
  chatList: ChatList[];
  onDelete: () => void;
}
