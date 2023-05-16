import React from 'react';
import { Button, Tabs } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import useChatList from '@/hooks/useChatList';
import ChatItem from '../chat-item';

const ChatTree: React.FC = function ChatTree() {
  const { chatList, handleNewChat } = useChatList();

  return (
    <Tabs
      className="w-full h-full px-2 flex flex-col"
      style={{ borderRight: '1px solid var(--semi-color-border)' }}
      contentStyle={{ height: 0, flexGrow: 1 }}
      tabBarExtraContent={<Button type="tertiary" icon={<IconPlus />} onClick={handleNewChat} />}
    >
      <Tabs.TabPane className="h-full overflow-auto" tab="Tile View" itemKey="tile">
        {chatList.length > 0 ? chatList.map((chat) => <ChatItem key={chat.chatId} chat={chat} />) : null}
      </Tabs.TabPane>
      {/* <Tabs.TabPane tab="Tree View" itemKey="tree">
        123
      </Tabs.TabPane> */}
    </Tabs>
  );
};

export default ChatTree;
