import React, { useState, useCallback } from 'react';
import { Icon, Toast, Popconfirm, SideSheet } from '@douyinfe/semi-ui';
import { IconMenu, IconSetting } from '@douyinfe/semi-icons';
import classNames from 'classnames';
import Moon from '@/assets/svg/moon.svg';
import Add from '@/assets/svg/add.svg';
import Sun from '@/assets/svg/sun.svg';
import Delete from '@/assets/svg/delete.svg';
import TabItem from '@/components/tab-item';
import useConfigSetting from '@/components/config-setting/useConfigSetting';
import useChatList from '@/hooks/useChatList';

const commonCls = 'flex py-3 px-3 items-center shrink-0 gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm';
export type Mode = 'light' | 'dark' | false;

const Header: React.FC = function Header() {
  const { handleNewChat, chatList, handleDeleteAll } = useChatList();

  const open = useConfigSetting();

  const [visible, setVisible] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window.matchMedia === 'function') {
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return darkMode ? 'dark' : 'light';
    }
    return false; // 表示不支持暗色模式
  });

  const handleChangeMode = useCallback(() => {
    const html = document.getElementsByTagName('html')[0];
    if (mode === 'light') {
      setMode('dark');
      html.classList.remove('light');
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      document.body.setAttribute('theme-mode', 'dark');
    } else {
      setMode('light');
      html.classList.remove('dark');
      html.classList.add('light');
      html.style.colorScheme = 'light';
      if (document.body.hasAttribute('theme-mode')) {
        document.body.removeAttribute('theme-mode');
      }
    }
  }, [mode]);

  return (
    <div className="sticky shrink-0 top-0 z-11 h-12 flex items-center justify-between border-b border-white/20 bg-gray-800 text-gray-200 sm:pl-3">
      <button className={classNames(commonCls, 'hidden', 'max-md:flex')} type="button" onClick={() => setVisible(true)}>
        <IconMenu />
      </button>
      <div className="flex-grow flex items-center justify-end">
        {chatList.length > 0 && (
          <Popconfirm
            title="Are you sure you want to delete all conversations?"
            content="Once deleted, all conversations will be removed and cannot be restored."
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={() => {
              handleDeleteAll();
              Toast.success('Deletion successful');
            }}
          >
            <button className={commonCls} type="button">
              <Icon svg={<Delete />} />
            </button>
          </Popconfirm>
        )}
        <button className={commonCls} type="button" onClick={() => open()}>
          <IconSetting />
        </button>
        <button className={commonCls} onClick={handleChangeMode} type="button">
          <Icon svg={mode === 'dark' ? <Sun /> : <Moon />} />
        </button>
        <button className={commonCls} onClick={handleNewChat} type="button">
          <Icon svg={<Add />} />
          New Chat
        </button>
      </div>
      <SideSheet
        closable
        title="Conversation history"
        width="60%"
        headerStyle={{ padding: '12px' }}
        bodyStyle={{ padding: 0 }}
        visible={visible}
        placement="left"
        onCancel={() => setVisible(false)}
      >
        {chatList.length > 0 && chatList.map((chat) => <TabItem key={chat.chatId} chat={chat} />)}
      </SideSheet>
    </div>
  );
};

export default Header;
