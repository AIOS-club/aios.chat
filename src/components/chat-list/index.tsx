import React, { useState } from 'react';
import { Button, Empty, Input } from '@douyinfe/semi-ui';
import { IconPlus, IconSearch } from '@douyinfe/semi-icons';
import useChatList from '@/hooks/useChatList';
import ChatItem from '@/components/chat-item';
import type { ChatList as ChatListProps } from '@/global';

const ChatList: React.FC = function ChatList() {
  const { chatList, handleNewChat } = useChatList();

  const [searchValue, setSearchValue] = useState<string>('');

  const filterChatList = (chat: ChatListProps) => (chat.title || chat.data[0]?.value || 'New Chat').includes(searchValue);

  const filterList = chatList?.filter(filterChatList);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col border-r-[1px] border-r-[var(--semi-color-border)]">
      <div className="flex-shrink-0 flex my-2 px-2">
        <Input
          className="flex-grow rounded-md"
          prefix={<IconSearch />}
          value={searchValue}
          onChange={setSearchValue}
          showClear
        />
        <Button className="flex-shrink-0 ml-2" type="tertiary" icon={<IconPlus />} onClick={() => handleNewChat()} />
      </div>
      <div className="h-1 flex-grow overflow-auto">
        {filterList?.length > 0 ? filterList.map((chat) => <ChatItem key={chat.chatId} chat={chat} />) : (
          <Empty description="No Data" />
        )}
      </div>
    </div>
  );
};

export default ChatList;
