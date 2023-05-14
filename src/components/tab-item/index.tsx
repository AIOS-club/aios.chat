import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Icon } from '@douyinfe/semi-ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Delete from '@/assets/svg/delete.svg';
import useChatList from '@/hooks/useChatList';
import { ChatList } from '@/global';

interface TabItemProps {
  chat: ChatList;
}

const defaultCls = 'w-calc-full my-2 mx-1 border border-black/20 flex text-black p-3 items-center relative rounded-md break-all group';

const TabItem: React.FC<TabItemProps> = function TabItem({ chat }) {
  const { chatId, data, title } = chat;

  const [query] = useSearchParams();

  const navigate = useNavigate();

  const { handleDelete: handleChatDelete } = useChatList();

  const actived = useMemo(() => query.get('chatId') === chatId, [query, chatId]);

  const handleClick = () => {
    navigate(`?chatId=${chatId}`);
  };

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    handleChatDelete(chatId);
  };

  return (
    <button
      className={classNames(defaultCls, { 'bg-slate-200': actived })}
      onClick={handleClick}
      type="button"
    >
      <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative text-left">
        {title || data[0]?.value || 'New Chat'}
      </div>
      {actived && <Icon svg={<Delete />} onClick={handleDelete} />}
    </button>
  );
};

export default TabItem;
