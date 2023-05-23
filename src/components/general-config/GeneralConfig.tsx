import React, { useState } from 'react';
import { Button, Form, Popconfirm, Toast } from '@douyinfe/semi-ui';
import type { RadioChangeEvent } from '@douyinfe/semi-ui/lib/es/radio';
import { GeneralConfigProps } from './GeneralConfigProps';

export type Mode = 'light' | 'dark' | 'auto' | false;

const GeneralConfig: React.FC<GeneralConfigProps> = function GeneralConfig(props) {
  const { chatList, onDelete } = props;

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window.matchMedia === 'function') {
      const theme = localStorage?.getItem('theme') as Mode;
      if (theme) return theme;
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const html = document.getElementsByTagName('html')[0];
      if (html.className.includes('dark')) return 'dark';
      if (html.className.includes('light')) return 'light';
      return darkMode ? 'dark' : 'light';
    }
    return false; // 表示不支持暗色模式
  });

  const changeTheme = (theme: 'dark' | 'light') => {
    const html = document.getElementsByTagName('html')[0];
    html.classList.remove(theme === 'light' ? 'dark' : 'light');
    html.classList.add(theme);
    html.style.colorScheme = theme;
    document.body.setAttribute('theme-mode', theme);
    if (theme === 'light' && document.body.hasAttribute('theme-mode')) {
      document.body.removeAttribute('theme-mode');
    }
  };

  const handleChangeMode = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setMode(value);
    localStorage?.setItem('theme', value);
    if (value === 'dark' || value === 'light') {
      changeTheme(value);
    } else {
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      changeTheme(darkMode ? 'dark' : 'light');
    }
  };

  return (
    <Form labelPosition="left">
      {mode && (
        <Form.RadioGroup field="theme" initValue={mode} onChange={handleChangeMode}>
          <Form.Radio value="light">Light</Form.Radio>
          <Form.Radio value="dark">Dark</Form.Radio>
          <Form.Radio value="auto">Automatic</Form.Radio>
        </Form.RadioGroup>
      )}
      <Form.Slot label="Clear all chats">
        {chatList?.length > 0 && (
          <Popconfirm
            title="Are you sure you want to delete all conversations?"
            content="Once deleted, all conversations will be removed and cannot be restored."
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={() => {
              onDelete();
              Toast.success('Deletion successful');
            }}
          >
            <Button className="bg-[var(--semi-color-danger)]" theme="solid" type="danger">
              Clear
            </Button>
          </Popconfirm>
        )}
      </Form.Slot>
    </Form>
  );
};

export default GeneralConfig;
