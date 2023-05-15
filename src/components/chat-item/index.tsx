import React, { Suspense, lazy } from 'react';
import { ChatList } from '@/global';

interface ChatItemProps {
  chat: ChatList;
}

const ChatItemComponent = lazy(async () => import('./ChatItem'));

const ChatItem: React.FC<ChatItemProps> = function ChatItem({ chat }) {
  return (
    <Suspense fallback={<span>...</span>}>
      <ChatItemComponent chat={chat} />
    </Suspense>
  );
};

export default ChatItem;
