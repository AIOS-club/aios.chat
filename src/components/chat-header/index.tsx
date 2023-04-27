import React, { useCallback, useRef, useState } from 'react';
import Icon, {
  IconClose, IconCheckboxIndeterminate, IconExpand, IconShrink, IconSetting 
} from '@douyinfe/semi-icons';
import { Popconfirm, Modal, Toast } from '@douyinfe/semi-ui';
import ChatConfig from '@/components/chat-config';
import Emoji from '@/components/emoji';
import useChatList from '@/hooks/useChatList';
import { ChatHeaderProps } from './ChatHeader';

const ChatHeader: React.FC<ChatHeaderProps> = function ChatHeader(props) {
  const {
    title, chatId, disabled, onResize, icon, systemMessage
  } = props;

  const [zoomFlag, setZoomFlag] = useState<boolean>(false);

  const chatConfigRef = useRef<any>();

  const { handleDelete, setCurrentChat, setDisplayDock, handleChatValueChange } = useChatList();

  const handleClose = useCallback(() => {
    if (disabled) return;
    handleDelete(chatId);
    onResize('0%', '0%');
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
    const widthSize = zoomFlag ? '80%' : '100%';
    const heightSize = zoomFlag ? '80%' : '100%';
    onResize(widthSize, heightSize);
    setZoomFlag(!zoomFlag);
    setDisplayDock(zoomFlag);
  }, [onResize, setDisplayDock, zoomFlag]);

  const handleSetting = useCallback(() => {
    chatConfigRef.current = Modal.info({
      title: 'Conversation configuration',
      style: { maxWidth: '100%' },
      bodyStyle: { marginLeft: '0' },
      content: (
        <ChatConfig
          chatId={chatId}
          originTitle={title}
          originIcon={icon}
          handleChange={handleChatValueChange}
          systemMessage={systemMessage}
        />
      ),
      okText: 'Save',
      cancelText: 'Cancel',
      onOk: () => {
        Toast.success('Modification successful');
      },
      onCancel: () => {
        // TODO 需要优化
        handleChatValueChange?.(chatId, 'title', title);
        handleChatValueChange?.(chatId, 'icon', icon);
        handleChatValueChange?.(chatId, 'icon', systemMessage);
        chatConfigRef.current?.destroy();
      }
    });
  }, [title, icon, chatId, systemMessage, handleChatValueChange]);

  return (
    <div className="chat-header w-full h-10 px-3 flex items-center bg-white text-gray-800 dark:text-gray-100 dark:bg-gray-700 border-b border-black/10">
      <div className="flex items-center flex-grow">
        <IconSetting className="cursor-pointer mr-2 flex-shrink-0" onClick={handleSetting} />
        <Emoji className="flex-shrink-0 mr-2" icon={icon} size="1rem" />
        <span className="flex-grow w-0 break-keep whitespace-nowrap overflow-x-hidden text-ellipsis">{title}</span>
      </div>
      <div className="flex-shrink-0 flex items-center">
        <IconCheckboxIndeterminate className="cursor-pointer mx-2" onClick={handleZoomOut} />
        <Popconfirm okText="Confirm" cancelText="Cancel" title="Are you sure you want to delete this conversation?" onConfirm={handleClose}>
          <IconClose className="cursor-pointer mx-2" />
        </Popconfirm>
        <Icon className="cursor-pointer mx-2" svg={zoomFlag ? <IconShrink /> : <IconExpand />} onClick={handleZoom} />
      </div>
    </div>
  );
};

export default ChatHeader;
