import React, { useState } from 'react';
import { Button, Empty, Input, Tabs } from '@douyinfe/semi-ui';
import { IconPlus, IconSearch } from '@douyinfe/semi-icons';
import useChatList from '@/hooks/useChatList';
import ChatItem from '../chat-item';
import { ChatList } from '@/global';

const ChatTree: React.FC = function ChatTree() {
  const { chatList, handleNewChat } = useChatList();

  const [searchValue, setSearchValue] = useState<string>('');

  const filterChatList = (chat: ChatList) => (chat.title || chat.data[0]?.value || 'New Chat').includes(searchValue);

  const filterList = chatList.filter(filterChatList);

  return (
    <Tabs
      className="w-full h-full px-2 flex flex-col"
      style={{ borderRight: '1px solid var(--semi-color-border)' }}
      contentStyle={{ height: 0, flexGrow: 1 }}
      tabBarExtraContent={<Button type="tertiary" icon={<IconPlus />} onClick={handleNewChat} />}
    >
      <Tabs.TabPane className="h-full overflow-auto" tab="Tile View" itemKey="tile">
        <Input prefix={<IconSearch />} value={searchValue} onChange={setSearchValue} showClear />
        {filterList.length > 0 ? filterList.map((chat) => <ChatItem key={chat.chatId} chat={chat} />) : (
          <Empty description="No Data" />
        )}
      </Tabs.TabPane>
      {/* <Tabs.TabPane tab="Tree View" itemKey="tree">
        123
      </Tabs.TabPane> */}
    </Tabs>
  );
};

export default ChatTree;
