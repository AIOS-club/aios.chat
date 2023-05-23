import { ChatList, NewChatProps } from '@/global';
import { Conversation } from '@/components/conversation/ConversationProps';

export interface ChatProps {
  chat: ChatList;
  onOpenConfig: () => void;
}

export interface CheckOptionsProps {
  chat: ChatList;
  data: Conversation[];
  checkList: Conversation[];
  onCheckListChange: React.Dispatch<React.SetStateAction<Conversation[]>>;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  handleNewChat: (chatProps: NewChatProps) => void;
}

export interface OptionButtonProps {
  text: string;
  type: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
  icon: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export interface ChatHeaderProps {
  title: string;
  model?: string;
  showSelectButton: boolean;
  onOpenConfig: () => void;
  onSelectList: () => void;
}
