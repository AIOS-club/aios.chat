import React, { useState } from 'react';
import { Button, ButtonGroup, Form, Toast } from '@douyinfe/semi-ui';
import { ChatConfigProps } from './ChatConfig';
import SystemMessage from './SystemMesage';

const ChatConfig: React.FC<ChatConfigProps> = function ChatConfig(props) {
  const { chat, onConfirm } = props;

  const { title, data, chatId, systemMessage } = chat;

  const [smList, setSmList] = useState<string[]>(() => {
    const parsedSystemMessage = Array.isArray(systemMessage) ? systemMessage : [systemMessage || ''] as string[];
    return parsedSystemMessage.filter((message) => message);
  });

  const initKey: string = title || data[0]?.value || '';

  const handleSubmit = (values: any) => {
    onConfirm(chatId, 'title', values?.title);
    onConfirm(chatId, 'systemMessage', [...(smList || [])]);
    Toast.success('Save successful');
  };

  const handleReset = () => {
    const parsedSystemMessage = Array.isArray(systemMessage) ? systemMessage : [systemMessage || ''] as string[];
    setSmList(parsedSystemMessage.filter((message) => message));
  };

  return (
    <Form
      key={`${initKey}${JSON.stringify(systemMessage) || ''}`}
      labelPosition="top"
      className="h-full w-full"
      onSubmit={handleSubmit}
    >
      <Form.Input
        field="title"
        label="Title"
        initValue={initKey}
        placeholder="Fill in the title here"
        showClear
      />
      <Form.Slot label="System Message">
        <SystemMessage key={JSON.stringify(smList)} data={smList} onChange={setSmList} />
      </Form.Slot>
      <ButtonGroup className="mt-4">
        <Button htmlType="submit" className="flex-1" theme="solid">Save</Button>
        <Button htmlType="reset" className="flex-1" type="secondary" onClick={handleReset}>Reset</Button>
      </ButtonGroup>
    </Form>
  );
};

export default ChatConfig;
