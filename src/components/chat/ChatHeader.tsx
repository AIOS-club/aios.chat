import React from 'react';
import { IconCheckList, IconMore } from '@douyinfe/semi-icons';
import { Button, Typography } from '@douyinfe/semi-ui';
import { ChatHeaderProps } from './Chat';

const ChatHeader: React.FC<ChatHeaderProps> = function ChatHeader(props) {
  const {
    title, showSelectButton, model, onSelectList, onOpenConfig 
  } = props;

  return (
    <div className="h-10 leading-10 pl-6 flex" style={{ borderBottom: '1px solid var(--semi-color-border)' }}>
      <div className="w-0 flex-grow overflow-hidden text-ellipsis break-keep whitespace-nowrap">
        {title || 'New Chat'}
      </div>
      <Typography.Text type="secondary" className="!ml-4  flex-shrink-0 !leading-10">
        {model}
      </Typography.Text>
      {showSelectButton && (
        <Button className="!h-full flex-shrink-0 !ml-4" type="tertiary" icon={<IconCheckList />} onClick={onSelectList} />
      )}
      <Button className="!h-full flex-shrink-0 !ml-2" type="tertiary" icon={<IconMore />} onClick={onOpenConfig} />
    </div>
  );
};

export default ChatHeader;
