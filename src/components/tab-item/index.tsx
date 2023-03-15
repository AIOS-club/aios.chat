import React, { useContext, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { Icon } from '@douyinfe/semi-ui';
import { Store } from '@/pages/index';
import Chat from '@/assets/chat.svg';
import Delete from '@/assets/delete.svg';
import { ChatList, ChatStoreProps, Messages } from '@/global';
import { useFetchAnswer } from '@/api';
import { encode } from '@/utils/encoder/encoder';

interface TabItemProps {
  chat: ChatList;
}

const defaultCls = 'flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#1e293b] cursor-pointer break-all group';

const TabItem: React.FC<TabItemProps> = ({ chat }) => {
  const { chatId, data, title, titleBlock } = chat;

  const { handleDelete: handleChatDelete, handleTitleChange, handleTitleBlock } = useContext<ChatStoreProps>(Store);

  const [query] = useSearchParams();

  const navigate = useNavigate();

  const { trigger } = useFetchAnswer();

  const generateTitleFlag = useMemo(() => {
    const noTitleFlag = data.length >= 2 && !title;
    const correctTitleFlag = !data[0]?.error && !data[1]?.error && data[0]?.value && data[1]?.value;
    return noTitleFlag && correctTitleFlag && !titleBlock;
  }, [data, title, titleBlock]);

  const { messages, titleTokenLength } = useMemo(() => {
    const content = `请你根据以下对话生成一个对话标题:\nHuman:${data[0]?.value}\nAI:${data[1]?.value}\n,你需要返回的是该段对话标题的中心思想, 不要返回无关文字`;
    const _messages: Messages[] = [{ role: 'user', content }];
    const tokenLength = encode(content).length;
    return { messages: _messages, titleTokenLength: tokenLength };
  }, [data]);

  const generateTitle = useCallback(async (messages: Messages[], tokenLength: number) => {
    await trigger({ messages, tokenLength } as any).then((res: any) => {
      if (res.status === 200) {
        const { data } = res;
        const error = !Array.isArray(data?.choices) || data?.choices?.[0]?.block;
        if (!error) {
          const text: string = data.choices[0]?.message?.content;
          const curValue = text.trimStart().replace(/\n{2,}/g, '\n');
          handleTitleChange(chatId, curValue);
        } else {
          handleTitleBlock(chatId);
        }
      }
    });
  }, [trigger, handleTitleChange, handleTitleBlock, chatId]);

  useEffect(() => {
    if (generateTitleFlag) {
      if (titleTokenLength > 3000) {
        handleTitleBlock(chatId);
        return;
      }
      generateTitle(messages, titleTokenLength).catch(() => {});
    }
  }, [generateTitle, handleTitleBlock, chatId, generateTitleFlag, titleTokenLength, messages]);

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
    >
      <Icon svg={<Chat />} />
      <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative text-left'>
        {title || data[0]?.value || '新对话'}
      </div>
      {actived && <Icon svg={<Delete />} onClick={handleDelete} />}
    </button>
  );
};

export default TabItem;
