import React, { useCallback } from 'react';
import Icon, { IconClose, IconCheckboxIndeterminate, IconExpand } from '@douyinfe/semi-icons';
import useChatList from '@/hooks/useChatList';
import { ChatHeaderProps } from './ChatHeader';

const ChatHeader: React.FC<ChatHeaderProps> = function ChatHeader(props) {
  const { title, chatId, disabled } = props;

  const { handleDelete, setCurrentChat } = useChatList();

  const handleClose = useCallback((event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (disabled) return;
    event.stopPropagation();
    event.preventDefault();
    handleDelete(chatId);
    setCurrentChat(undefined);
  }, [chatId, disabled, handleDelete, setCurrentChat]);

  const handleZoomOut = useCallback((event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (disabled) return;
    event.stopPropagation();
    event.preventDefault();
    setCurrentChat(undefined);
  }, [disabled, setCurrentChat]);

  const handleZoom = useCallback(() => {
    
  }, []);

  return (
    <div className="chat-header w-full h-10 px-3 flex items-center bg-white text-gray-800 dark:text-gray-100 dark:bg-gray-700 border-b border-black/10">
      <span className="flex-grow break-keep whitespace-nowrap overflow-x-hidden text-ellipsis">{title}</span>
      <div className="flex-shrink-0 flex items-center">
        <Icon className="cursor-pointer mx-2" svg={<IconCheckboxIndeterminate />} onClick={handleZoomOut} />
        <Icon className="cursor-pointer mx-2" svg={<IconClose />} onClick={handleClose} />
        <Icon className="cursor-pointer mx-2" svg={<IconExpand />} onClick={handleZoom} />
      </div>
    </div>
  );
};

export default ChatHeader;
