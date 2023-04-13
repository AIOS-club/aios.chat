import React, { lazy, Suspense } from 'react';
import { ChatList } from '@/global';

const ChatIconComponent = lazy(async () => import('./ChatIcon'));

interface ChatIconProps {
  chat: ChatList;
}

const ChatIcon: React.FC<ChatIconProps> = function ChatIcon(props) {
  const { chat } = props;
  return (
    <Suspense fallback={<span>...</span>}>
      <ChatIconComponent chat={chat} />
    </Suspense>
  );
};

export default ChatIcon;
