import React from 'react';
import { Form } from '@douyinfe/semi-ui';
import { ChatConfigProps } from './ChatConfig';

const ChatConfig: React.FC<ChatConfigProps> = function ChatConfig(props) {
  const { originTitle, chatId, systemMessage, handleChange } = props;

  return (
    <Form labelPosition="top" style={{ padding: '20px 0' }}>
      <Form.Input
        field="title"
        label="Title"
        initValue={originTitle}
        onChange={(value) => handleChange?.(chatId, 'title', value)}
      />
      <Form.Input
        field="systemMessage"
        label="System Message"
        initValue={systemMessage}
        placeholder="eg: You are a translation assistant"
        onChange={(value) => handleChange?.(chatId, 'systemMessage', value)}
      />
    </Form>
  );
};

export default ChatConfig;
