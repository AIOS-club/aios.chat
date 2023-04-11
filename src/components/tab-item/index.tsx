import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { Icon } from '@douyinfe/semi-ui';
import Chat from '@/assets/svg/chat.svg';
import Delete from '@/assets/svg/delete.svg';
import useChatList from '@/hooks/useChatList';
import { ChatList } from '@/global';

interface TabItemProps {
  chat: ChatList;
}

const defaultCls = 'flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#1e293b] cursor-pointer break-all group';

const TabItem: React.FC<TabItemProps> = function TabItem({ chat }) {
  const { chatId, data, title } = chat;

  const { handleDelete: handleChatDelete } = useChatList();

  const [query] = useSearchParams();

  const navigate = useNavigate();

  const actived = useMemo(() => {
    const chatIdFromUrl = query.get('chatId');
    return chatIdFromUrl === chatId;
  }, [query, chatId]);

  const handleClick = () => {
    navigate(`/?chatId=${chatId}`);
  };

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    handleChatDelete(chatId);
  };

  return (
    <button
      className={classNames(defaultCls, { 'bg-slate-800': actived })}
      onClick={handleClick}
      type="button"
    >
      <Icon svg={<Chat />} />
      <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative text-left">
        {title || data[0]?.value || '新对话'}
      </div>
      {actived && <Icon svg={<Delete />} onClick={handleDelete} />}
    </button>
  );
};

export default TabItem;
