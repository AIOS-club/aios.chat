import React, { useState, useCallback, useRef } from 'react';
import { Icon, Modal, Toast, Popconfirm } from '@douyinfe/semi-ui';
import { IconSetting } from '@douyinfe/semi-icons';
import Moon from '@/assets/svg/moon.svg';
import Add from '@/assets/svg/add.svg';
import Sun from '@/assets/svg/sun.svg';
import Delete from '@/assets/svg/delete.svg';
import ConfigSetting from '@/components/config-setting';
import useChatList from '@/hooks/useChatList';

const commonCls = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm';
export type Mode = 'light' | 'dark' | false;

const Header: React.FC = function Header() {
  const {
    handleNewChat, config, handleConfigChange, chatList, handleDeleteAll 
  } = useChatList();

  const configRef = useRef<any>();

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
    } else {
      setMode('light');
      html.classList.remove('dark');
      html.classList.add('light');
      html.style.colorScheme = 'light';
    }
  }, [mode]);

  const handleInputKey = useCallback(() => {
    const preConfig = { ...(config || {}) };
    configRef.current = Modal.info({
      header: (
        <div className="py-6 font-semibold flex items-center">
          <IconSetting className="mr-2" />
          Setting
        </div>
      ),
      style: { top: '100px', maxWidth: '100%' },
      bodyStyle: { marginLeft: 0 },
      content: <ConfigSetting handleConfigChange={handleConfigChange} config={config} />,
      okText: '保存',
      onOk: () => {
        Toast.success('保存成功');
        configRef.current?.destroy();
      },
      onCancel: () => {
        handleConfigChange(preConfig);
        configRef.current?.destroy();
      }
    });
  }, [config, handleConfigChange]);

  return (
    <div className="sticky shrink-0 top-0 z-11 h-12 flex items-center justify-end border-b border-white/20 bg-gray-800 text-gray-200 sm:pl-3">
      {chatList.length > 0 && (
        <Popconfirm
          title="确定要删除所有对话吗？"
          content="删除后所有对话都会清除，无法恢复"
          onConfirm={() => {
            handleDeleteAll();
            Toast.success('删除成功');
          }}
        >
          <button className={commonCls} type="button">
            <Icon svg={<Delete />} />
          </button>
        </Popconfirm>
      )}
      <button className={commonCls} onClick={handleNewChat} type="button">
        <Icon svg={<Add />} />
      </button>
      <button className={commonCls} type="button" onClick={handleInputKey}>
        <IconSetting />
      </button>
      <button className={commonCls} onClick={handleChangeMode} type="button">
        <Icon svg={mode === 'dark' ? <Sun /> : <Moon />} />
      </button>
    </div>
  );
};

export default Header;
