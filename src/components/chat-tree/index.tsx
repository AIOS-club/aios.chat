import React, { Suspense, lazy } from 'react';

const ChatTreeComponent = lazy(async () => import('./ChatTree'));

const ChatTree: React.FC = function ChatTree() {
  return (
    <Suspense fallback={<span>...</span>}>
      <ChatTreeComponent />
    </Suspense>
  );
};

export default ChatTree;
