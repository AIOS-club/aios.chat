import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';
import { Icon, Modal, Popconfirm, Toast } from '@douyinfe/semi-ui';
import ChatItem from '@/components/chat-item';
import useIsMobile from '@/hooks/useIsMobile';
import { Store } from '@/pages/index';
import { ChatStoreProps } from '@/global';
import Moon from '@/assets/moon.svg';
import Sun from '@/assets/sun.svg';
import Add from '@/assets/add.svg';
import AddOne from '@/assets/add-one.svg';
import Delete from '@/assets/delete.svg';
import Bread from '@/assets/bread.svg';
import Close from '@/assets/close.svg';
import { Mode, SideBarProps } from './Sidebar';

const commonCls = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm';

const useNewChat = (onNewChat: any) => {
  const handleNewChat = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    onNewChat();
  };
  return handleNewChat;
};

const Nav: React.FC<SideBarProps> = (props) => {
  const { chatList, handleDeleteAll } = useContext<ChatStoreProps>(Store);

  const { onNewChat = () => {} } = props;

  const isMobile = useIsMobile();

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window.matchMedia === 'function') {
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return darkMode ? 'dark' : 'light';
    } else {
      return false; // 表示不支持暗色模式
    }
  });

  const handleNewChat = useNewChat(onNewChat);

  const handleChangeMode = () => {
    // 能进这里表示mode不是dark就是light
    const html = document.getElementsByTagName('html')[0];
    if (mode === 'light') {
      setMode('dark');
      html.classList.remove('light');
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      setMode('light');
      html.classList.remove('dark');
      html.classList.add('light');
      html.style.colorScheme = 'light';
    }
  };

  return (
    <div className={`flex h-full w-full flex-1 items-start border-white/20 ${isMobile ? 'scrollbar-trigger' : ''}`}>
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <button className={classNames(commonCls, 'mb-2 flex-shrink-0 border border-white/20')} onClick={handleNewChat}>
          <Icon svg={<Add />} />开始新对话
        </button>
        <div className="flex-col flex-1 overflow-y-auto border-b border-white/20 hidden-scroll-bar">
          <div className="flex flex-col gap-2 text-gray-100 text-sm">
            {chatList.length > 0 && chatList.map(chat => <ChatItem key={chat.chatId} chat={chat} />)}
          </div>
        </div>
        {chatList.length > 0 && (
          <Popconfirm
            title="确定要删除所有对话吗？"
            content="删除后所有对话都会清除，无法恢复"
            onConfirm={() => {
              handleDeleteAll();
              Toast.success('删除成功');
            }}
          >
            <button className={commonCls}><Icon svg={<Delete />} />清除所有会话</button>
          </Popconfirm>
        )}
        {mode ? (
          <button className={commonCls} onClick={handleChangeMode}>
            <Icon svg={mode === 'dark' ? <Sun /> : <Moon />} />
            {`${mode === 'dark' ? '亮色' : '暗色'}`}
          </button>
        ) : null}
      </nav>
    </div>
  );
};

export const HeaderBar: React.FC<SideBarProps> = (props) => {
  const { onNewChat = () => {} } = props;

  const handleNewChat = useNewChat(onNewChat);

  const [visible, setVisible] = useState(false);

  const onClose = () => {
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const modalDom = useRef(null);

  const clickMask = (e: React.MouseEvent) => {
    modalDom.current === e.target && onClose();
  };

  return (
    <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
      <div>
        <button type="button" className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white" onClick={showModal}>
          <span className="sr-only">打开侧边栏</span>
          <Bread />
        </button>
        <Modal title={null} footer={null} visible={visible} onOk={onClose} onCancel={onClose} style={{ width: 0 }} motion={false} closable={false} maskClosable={true}>
          <div className="fixed inset-0 z-40 flex" onClick={clickMask} ref={modalDom}>
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 translate-x-0" id="headlessui-dialog-panel-:r1:" data-headlessui-state="open">
              <div className="absolute top-0 right-0 -mr-12 pt-2 opacity-100">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={onClose}
                >
                  <span className="sr-only">关闭侧边栏</span>
                  <Close />
                </button>
              </div>
              <Nav onNewChat={props.onNewChat} />
            </div>
            <div className="w-14 flex-shrink-0">
            </div>
          </div>
        </Modal>
      </div>
      <h1 className="flex-1 text-center text-base font-normal">新对话</h1>
      <button type="button" className="px-3" onClick={handleNewChat}>
        <AddOne />
      </button>
    </div>
  );
};

const SideBar: React.FC<SideBarProps> = (props) => {
  return (
    <div className="hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col">
      <div className="flex h-full min-h-0 flex-col ">
        <Nav onNewChat={props.onNewChat} />
      </div>
    </div>
  );
};

export default SideBar;
