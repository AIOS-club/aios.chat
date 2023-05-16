import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, Form, Toast } from '@douyinfe/semi-ui';
import { ChatConfigProps } from './ChatConfig';

const ChatConfig: React.FC<ChatConfigProps> = function ChatConfig(props) {
  const { chat, onConfirm } = props;

  const { title, data, chatId, systemMessage } = chat;

  const initKey: string = title || data[0]?.value || '';

  const handleSubmit = (values: any) => {
    onConfirm(chatId, 'title', values?.title);
    onConfirm(chatId, 'systemMessage', values?.systemMessage);
    Toast.success('Save successful');
  };

  return (
    <Form
      key={`${initKey}${systemMessage || ''}`}
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
      <Form.TextArea
        field="systemMessage"
        label="System Message"
        initValue={systemMessage}
        placeholder="eg: You are a translation assistant"
        showClear
      />
      <ButtonGroup className="mt-4">
        <Button htmlType="submit" className="flex-1" theme="solid">Save</Button>
        <Button htmlType="reset" className="flex-1" type="secondary">Reset</Button>
      </ButtonGroup>
    </Form>
  );
};

export default ChatConfig;
