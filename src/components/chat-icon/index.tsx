import React, { lazy, Suspense } from 'react';
import { ChatIconProps } from './ChatIconPorps';

const ChatIconComponent = lazy(async () => import('./ChatIcon'));

const ChatIcon: React.FC<ChatIconProps> = function ChatIcon(props) {
  const { chat, className, size } = props;
  return (
    <Suspense fallback={<span>...</span>}>
      <ChatIconComponent chat={chat} className={className} size={size} />
    </Suspense>
  );
};

export default ChatIcon;
