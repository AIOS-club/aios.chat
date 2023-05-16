import React, { useCallback, useState } from 'react';
import {
  Button, Form, Tabs, Tooltip, Popconfirm, Toast
} from '@douyinfe/semi-ui';
import { IconHelpCircle } from '@douyinfe/semi-icons';
import PromptStore from '@/components/prompt-store';
import { Config } from '@/global';
import { ConfigSettingProps } from './ConfigSetting';

const API_HOST: string = import.meta.env.VITE_API_HOST;

export type Mode = 'light' | 'dark' | false;

const ConfigSetting: React.FC<ConfigSettingProps> = function ConfigSetting(props) {
  const {
    handleConfigChange, config, tips, chatList, handleDeleteAll 
  } = props;

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window.matchMedia === 'function') {
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const html = document.getElementsByTagName('html')[0];
      if (html.className.includes('dark')) {
        return 'dark';
      }
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

  const handleValuesChange = useCallback((values: Config) => {
    handleConfigChange(values);
  }, [handleConfigChange]);

  const labelTips = useCallback((content: string) => (
    <Tooltip content={content}><IconHelpCircle className="pt-[2px]" /></Tooltip>
  ), []);

  return (
    <Tabs defaultActiveKey={tips ? '1' : '0'}>
      <Tabs.TabPane tab="General" itemKey="0">
        <Form labelPosition="left">
          {mode && (
            <Form.RadioGroup field="theme" initValue={mode} onChange={handleChangeMode}>
              <Form.Radio value="light">Light</Form.Radio>
              <Form.Radio value="dark">Dark</Form.Radio>
            </Form.RadioGroup>
          )}
          <Form.Slot label="Clear all chats">
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
                <Button className="bg-[var(--semi-color-danger)]" theme="solid" type="danger">
                  Clear
                </Button>
              </Popconfirm>
            )}
          </Form.Slot>
        </Form>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Chat" itemKey="1">
        <Form labelPosition="left" onValueChange={handleValuesChange}>
          {tips ? <div className="text-[#ff0000]">{tips}</div> : null}
          <Form.Select field="model" initValue={config.model || 'gpt-3.5-turbo'} disabled />
          <Form.Input field="apiHost" initValue={config.apiHost || API_HOST} showClear />
          <Form.Input field="apiKey" initValue={config.apiKey} showClear />
          <Form.Slider
            field="temperature"
            initValue={config.temperature ?? 0.8}
            label={{ text: 'temperature', extra: labelTips('A higher value will make the output more random.') }}
            min={0}
            max={2}
            step={0.1}
            marks={{ 0: '0', 1: '1', 2: '2' }}
          />
          <Form.Slider
            field="presence_penalty"
            initValue={config.presence_penalty ?? -1.0}
            label={{ text: 'presence_penalty', extra: labelTips('A higher value will make it easier to shift the conversation topic.') }}
            min={-2}
            max={2}
            step={0.1}
            marks={{
              '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2'
            }}
          />
          <Form.Slider
            field="frequency_penalty"
            initValue={config.frequency_penalty ?? 1.0}
            label={{ text: 'frequency_penalty', extra: labelTips('The higher the value, the lower the repetition rate of the output.') }}
            min={-2}
            max={2}
            step={0.1}
            marks={{
              '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2'
            }}
          />
          <Form.Switch field="stream" initValue={config.stream} />
        </Form>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Prompt Store" itemKey="2">
        <PromptStore />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default ConfigSetting;
