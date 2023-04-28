import { ChatList } from '@/global';

export interface LaunchPadProps {
  chatList: ChatList[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClickItem: (chat?: ChatList) => void;
  onDeleteItem: (chatId: string) => void;
}
