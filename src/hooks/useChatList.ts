import { useContext } from 'react';
import { ChatStoreProps } from '@/global';
import { Store } from '@/pages/index';

function useChatList() {
  return useContext<ChatStoreProps>(Store);
}

export default useChatList;
