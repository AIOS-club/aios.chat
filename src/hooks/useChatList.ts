import { useContext } from 'react';
import { ChatStoreProps } from '@/global';
import { Store } from '@/store/ChatStore';

function useChatList() {
  return useContext<ChatStoreProps>(Store);
}

export default useChatList;
