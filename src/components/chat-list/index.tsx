import React, { useMemo, useState } from 'react';
import { Button, Dropdown, Empty, Input } from '@douyinfe/semi-ui';
import { IconPlus, IconSearch } from '@douyinfe/semi-icons';
import useChatList from '@/hooks/useChatList';
import ChatItem from '@/components/chat-item';
import type { ChatList as ChatListProps } from '@/global';

const ChatList: React.FC = function ChatList() {
  const { chatList, handleNewChat } = useChatList();

  const [searchValue, setSearchValue] = useState<string>('');

  const filterChatList = (chat: ChatListProps) => (chat.title || chat.data[0]?.value || 'New Chat').includes(searchValue);

  const filterList = chatList?.filter(filterChatList);

  const renderChatModelList = useMemo(() => (
    <Dropdown.Menu>
      <Dropdown.Item onClick={() => handleNewChat({ model: 'gpt-3.5-turbo' })}>gpt-3.5-turbo</Dropdown.Item>
      <Dropdown.Item onClick={() => handleNewChat({ model: 'gpt-4' })}>gpt4</Dropdown.Item>
    </Dropdown.Menu>
  ), [handleNewChat]);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col border-r-[1px] border-r-[var(--semi-color-border)]">
      <div className="flex-shrink-0 flex !my-2 !px-2">
        <Input
          className="flex-grow rounded-md"
          prefix={<IconSearch />}
          value={searchValue}
          onChange={setSearchValue}
          showClear
        />
        <Dropdown clickTriggerToHide trigger="click" content={renderChatModelList}>
          <Button className="flex-shrink-0 !ml-2 !bg-transparent" type="tertiary" icon={<IconPlus />} />
        </Dropdown>
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
