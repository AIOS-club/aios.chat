import React from 'react';
import { Form, withField } from '@douyinfe/semi-ui';
import IconPicker from '@/components/icon-picker';
import { ChatConfigProps } from './ChatConfig';

const Picker = withField(IconPicker);

const ChatConfig: React.FC<ChatConfigProps> = function ChatConfig(props) {
  const { originIcon, originTitle, chatId, handleChange } = props;

  return (
    <Form labelPosition="left" style={{ padding: '20px 0' }}>
      <Picker
        field="icon"
        label="Icon"
        closeable
        icon={originIcon}
        onSelect={(icon) => handleChange?.(chatId, 'icon', icon)}
      />
      <Form.Input
        field="title"
        label="Title"
        initValue={originTitle}
        onChange={(value) => handleChange?.(chatId, 'title', value)}
      />
    </Form>
  );
};

export default ChatConfig;
