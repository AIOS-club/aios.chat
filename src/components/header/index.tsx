import React, { useState } from 'react';
import { SideSheet, Empty, Button } from '@douyinfe/semi-ui';
import { IconMenu, IconPlus, IconSetting } from '@douyinfe/semi-icons';
import ChatItem from '@/components/chat-item';
import useConfigSetting from '@/components/config-setting/useConfigSetting';
import useChatList from '@/hooks/useChatList';

const Header: React.FC = function Header() {
  const { handleNewChat, chatList } = useChatList();

  const open = useConfigSetting();

  const [visible, setVisible] = useState<boolean>(false);

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
        <Button type="tertiary" style={{ color: '#fff' }} icon={<IconPlus />} onClick={() => handleNewChat()}>
          New Chat
        </Button>
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
        getPopupContainer={() => document.querySelector('.layout-root') as HTMLElement}
      >
        {chatList?.length > 0 ? chatList.map((chat) => <ChatItem key={chat.chatId} chat={chat} />) : (
          <Empty description="No Data" />
        )}
      </SideSheet>
    </div>
  );
};

export default Header;
