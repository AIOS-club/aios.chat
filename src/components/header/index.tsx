/* eslint-disable max-len */
import React, { useState, useRef } from 'react';
import { Modal } from '@douyinfe/semi-ui';
import Bread from '@/assets/svg/bread.svg';
import Close from '@/assets/svg/close.svg';
import AddOne from '@/assets/svg/add-one.svg';
import { Nav } from '@/components/sidebar';
import { SideBarProps } from '@/components/sidebar/Sidebar';

const useNewChat = (onNewChat: any) => {
  const handleNewChat = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    onNewChat();
  };
  return handleNewChat;
};

const HeaderBar: React.FC<SideBarProps> = function HeaderBar(props) {
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
    if (modalDom.current === e.target) {
      onClose();
    }
  };

  return (
    <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
      <div>
        <button 
          type="button" 
          className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white" 
          onClick={showModal}
        >
          <span className="sr-only">打开侧边栏</span>
          <Bread />
        </button>
        <Modal title={null} footer={null} visible={visible} onOk={onClose} onCancel={onClose} style={{ width: 0 }} motion={false} closable={false} maskClosable>
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
              <Nav onNewChat={onNewChat} />
            </div>
            <div className="w-14 flex-shrink-0" />
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

export default HeaderBar;
