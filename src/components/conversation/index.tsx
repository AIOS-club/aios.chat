import React, { lazy, Suspense } from 'react';
import { ConversationProps } from './Conversation.d';

const ConversationCpm = lazy(async () => import('./Conversation'));

const Conversation: React.FC<ConversationProps> = function ChatIcon(props) {
  const { data } = props;
  return (
    <Suspense fallback={<span>...</span>}>
      <ConversationCpm data={data} />
    </Suspense>
  );
};

export default Conversation;
