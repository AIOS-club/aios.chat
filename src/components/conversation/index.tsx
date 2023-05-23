import React, { lazy, Suspense } from 'react';
import { ConversationProps } from './ConversationProps';

const ConversationCpm = lazy(async () => import('./Conversation').catch(() => ({ default: () => <div>failed</div> })));

const Conversation: React.FC<ConversationProps> = function ChatIcon(props) {
  const { data, showCheck, checkList, onCheckListChange } = props;
  return (
    <Suspense fallback={<span>...</span>}>
      <ConversationCpm data={data} showCheck={showCheck} checkList={checkList} onCheckListChange={onCheckListChange} />
    </Suspense>
  );
};

export default Conversation;
