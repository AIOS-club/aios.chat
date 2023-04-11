import React, { useCallback, useState } from 'react';
import Icon, { IconClose, IconCheckboxIndeterminate, IconExpand, IconShrink } from '@douyinfe/semi-icons';
import { Popconfirm } from '@douyinfe/semi-ui';
import useChatList from '@/hooks/useChatList';
import { ChatHeaderProps } from './ChatHeader';

const ChatHeader: React.FC<ChatHeaderProps> = function ChatHeader(props) {
  const { title, chatId, disabled, onResize } = props;

  const [zoomFlag, setZoomFlag] = useState<boolean>(false);

  const { handleDelete, setCurrentChat, setDisplayDock } = useChatList();

  const handleClose = useCallback(() => {
    if (disabled) return;
    handleDelete(chatId);
    onResize('0%');
    setDisplayDock(true);
  }, [chatId, disabled, handleDelete, onResize, setDisplayDock]);

  const handleZoomOut = useCallback((event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (disabled) return;
    event.stopPropagation();
    event.preventDefault();
    setCurrentChat(undefined);
    setDisplayDock(true);
  }, [disabled, setCurrentChat, setDisplayDock]);

  const handleZoom = useCallback(() => {
    onResize(zoomFlag ? '80%' : '100%');
    setZoomFlag(!zoomFlag);
    setDisplayDock(zoomFlag);
  }, [onResize, setDisplayDock, zoomFlag]);

  return (
    <div className="chat-header w-full h-10 px-3 flex items-center bg-white text-gray-800 dark:text-gray-100 dark:bg-gray-700 border-b border-black/10">
      <span className="flex-grow break-keep whitespace-nowrap overflow-x-hidden text-ellipsis">{title}</span>
      <div className="flex-shrink-0 flex items-center">
        <Icon className="cursor-pointer mx-2" svg={<IconCheckboxIndeterminate />} onClick={handleZoomOut} />
        <Popconfirm title="确定要删除该对话吗？" onConfirm={handleClose}>
          <Icon className="cursor-pointer mx-2" svg={<IconClose />} />
        </Popconfirm>
        <Icon className="cursor-pointer mx-2" svg={zoomFlag ? <IconShrink /> : <IconExpand />} onClick={handleZoom} />
      </div>
    </div>
  );
};

export default ChatHeader;
