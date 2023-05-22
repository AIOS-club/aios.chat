import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, ButtonGroup, Descriptions, Form, Toast 
} from '@douyinfe/semi-ui';
import { ChatConfigProps } from './ChatConfig';
import SystemMessage from './SystemMesage';

const ChatConfig: React.FC<ChatConfigProps> = function ChatConfig(props) {
  const { chat, parentChat, onConfirm, onClose } = props;

  const { title, data, chatId, systemMessage } = chat;

  const navigate = useNavigate();

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

  const handleRedirect = () => {
    if (parentChat) {
      navigate(`?chatId=${parentChat.chatId}`);
      onClose();
    }
  };

  return (
    <Form
      key={`${initKey}${JSON.stringify(systemMessage) || ''}`}
      labelPosition="top"
      className="h-full w-full"
      onSubmit={handleSubmit}
    >
      {parentChat && (
        <Form.Slot label="Source">
          <Descriptions className="border-[var(--semi-color-border)] border-[1px] rounded-md p-3">
            <Descriptions.Item itemKey="id">{parentChat.chatId}</Descriptions.Item>
            <Descriptions.Item itemKey="title">
              <div className="text-overflow-l4">
                {parentChat.title || parentChat.data[0]?.value}
              </div>
            </Descriptions.Item>
            <Descriptions.Item itemKey="redirect">
              <span className="text-[#40b4f3] cursor-pointer" onClick={handleRedirect}>
                Redirect to source chat
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Form.Slot>
      )}
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
