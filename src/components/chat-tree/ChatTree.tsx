import React from 'react';
import { Tabs } from '@douyinfe/semi-ui';
import useChatList from '@/hooks/useChatList';
import ChatItem from '../chat-item';

const ChatTree: React.FC = function ChatTree() {
  const { chatList } = useChatList();

  return (
    <Tabs
      className="px-2 w-[240px] h-full flex flex-col"
      style={{ borderRight: '1px solid var(--semi-color-border)' }}
      contentStyle={{ height: 0, flexGrow: 1 }}
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
