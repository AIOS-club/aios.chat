import React, { useState, useMemo } from 'react';
import { SideSheet, Empty, Button, Dropdown } from '@douyinfe/semi-ui';
import { IconMenu, IconPlus, IconSetting } from '@douyinfe/semi-icons';
import ChatItem from '@/components/chat-item';
import useConfigSetting from '@/components/config-setting/useConfigSetting';
import useChatList from '@/hooks/useChatList';

const Header: React.FC = function Header() {
  const { handleNewChat, chatList } = useChatList();

  const open = useConfigSetting();

  const [visible, setVisible] = useState<boolean>(false);

  const renderChatModelList = useMemo(() => (
    <Dropdown.Menu>
      <Dropdown.Item onClick={() => handleNewChat({ model: 'gpt-3.5-turbo' })}>gpt-3.5-turbo</Dropdown.Item>
      <Dropdown.Item onClick={() => handleNewChat({ model: 'gpt-4' })}>gpt4</Dropdown.Item>
    </Dropdown.Menu>
  ), [handleNewChat]);

  return (
    <div className="shrink-0 z-11 h-12 flex items-center justify-between border-b border-white/20 bg-gray-800 text-gray-200 sm:pl-3">
      <Button
        type="tertiary"
        icon={<IconMenu />}
        className="hidden max-md:flex"
        style={{ color: '#fff' }}
        onClick={() => setVisible(true)}
      />
      <div className="flex-grow flex items-center justify-end">
        <Button type="tertiary" style={{ color: '#fff' }} icon={<IconSetting />} onClick={() => open()} />
        <Dropdown clickTriggerToHide trigger="click" content={renderChatModelList}>
          <Button type="tertiary" style={{ color: '#fff' }} icon={<IconPlus />}>
            New Chat
          </Button>
        </Dropdown>
      </div>
      <SideSheet
        closable
        title="Conversation history"
        style={{ maxWidth: '80%' }}
        headerStyle={{ padding: '12px' }}
        bodyStyle={{ padding: '0 12px' }}
        visible={visible}
        placement="left"
        onCancel={() => setVisible(false)}
      >
        {chatList?.length > 0 ? chatList.map((chat) => <ChatItem key={chat.chatId} chat={chat} />) : (
          <Empty description="No Data" />
        )}
      </SideSheet>
    </div>
  );
};

export default Header;
