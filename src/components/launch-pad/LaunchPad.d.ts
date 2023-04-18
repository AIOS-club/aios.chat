import { ChatList } from '@/global';

export interface LaunchPadProps {
  chatList: ChatList[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClickItem: React.Dispatch<React.SetStateAction<ChatList | undefined>>;
}
