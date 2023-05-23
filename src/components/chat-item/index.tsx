import React, { useState } from 'react';
import classNames from 'classnames';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IconDeleteStroked } from '@douyinfe/semi-icons';
import { Icon } from '@douyinfe/semi-ui';
import Bot from '@/assets/svg/bot.svg';
import { ChatList } from '@/global';
import useChatList from '@/hooks/useChatList';

interface ChatItemProps {
  chat: ChatList;
}

const tileChatCls = 'w-full h-[80px] p-2 cursor-pointer hover:bg-[#eaeaea] dark:hover:bg-[#5a5a5a]';

const ChatItem: React.FC<ChatItemProps> = function ChatItem({ chat }) {
  const navigate = useNavigate();

  const [query] = useSearchParams();

  const checked = chat.chatId === query.get('chatId');
  const tileChatDynamicCls = { '!bg-[#eaeaea] dark:!bg-[#6a6a6a]': checked };

  const [show, setShow] = useState(false);

  const { handleDelete: onDelete } = useChatList();

  const handleClick = () => {
    navigate(`?chatId=${chat.chatId}`);
  };

  const handleDelete = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    onDelete(chat.chatId);
  };

  return (
    <div
      key={chat.chatId}
      className={classNames('flex items-center dark:bg-[#2b2b2b]', tileChatCls, tileChatDynamicCls)}
      style={{ borderBottom: '1px solid var(--semi-color-border)' }}
      onClick={handleClick}
      onTouchEnd={handleClick}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Icon className="flex-shrink-0 mr-2" svg={<Bot />} />
      <div className="w-0 flex-grow">
        <div className="w-full overflow-hidden text-ellipsis break-keep whitespace-nowrap text-[#000] dark:text-[#fff]">
          {chat.title || chat.data[0]?.value || 'New Chat'}  
        </div>
        {chat.lastUpdateTime && (
          <div className="text-[#606060] dark:text-[#b4b4b4] mt-1">
            {chat.lastUpdateTime}
          </div>
        )}
        <div className="text-[#606060] dark:text-[#b4b4b4] mt-1 flex items-center">
          <span className="flex-grow">
            {chat.data.length > 0 ? `${chat.data.length} records` : '[empty]'}
          </span>
          {(show || checked) && <IconDeleteStroked className="flex-shrink-0" onClick={handleDelete} />}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
