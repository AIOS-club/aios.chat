import React, { useState } from 'react';
import { Icon, SideSheet, Empty } from '@douyinfe/semi-ui';
import { IconMenu, IconSetting } from '@douyinfe/semi-icons';
import classNames from 'classnames';
import Add from '@/assets/svg/add.svg';
import ChatItem from '@/components/chat-item';
import useConfigSetting from '@/components/config-setting/useConfigSetting';
import useChatList from '@/hooks/useChatList';

const commonCls = 'flex py-3 px-3 items-center shrink-0 gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm';

const Header: React.FC = function Header() {
  const { handleNewChat, chatList } = useChatList();

  const open = useConfigSetting();

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className="shrink-0 z-11 h-12 flex items-center justify-between border-b border-white/20 bg-gray-800 text-gray-200 sm:pl-3">
      <button className={classNames(commonCls, 'hidden', 'max-md:flex')} type="button" onClick={() => setVisible(true)}>
        <IconMenu />
      </button>
      <div className="flex-grow flex items-center justify-end">
        <button className={commonCls} type="button" onClick={() => open()}>
          <IconSetting />
        </button>
        <button className={commonCls} onClick={() => handleNewChat()} type="button">
          <Icon svg={<Add />} />
          New Chat
        </button>
      </div>
      <SideSheet
        closable
        title="Conversation history"
        width="80%"
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
