import React, {
  useRef, useState, useMemo, useContext
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Icon } from '@douyinfe/semi-ui';
import axios from 'axios';
import ProjectSourceInfo from '@/components/project-source-info';
import { Conversation } from '@/components/conversation/Conversation';
import ConversationList from '@/components/conversation';
import AutoTextArea from '@/components/auto-textarea';
import useIsMobile from '@/hooks/useIsMobile';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import { getCachePrompt, parseMarkdown } from '@/utils';
import { Store } from '@/pages/index';
import Refresh from '@/assets/svg/refresh.svg';
import { ChatStoreProps } from '@/global';

const BOTTOM_TIPS = import.meta.env.VITE_DEFAULT_BOTTOM_TIPS;
const API_HOST: string = import.meta.env.VITE_API_HOST;

const { CancelToken } = axios;
const source = CancelToken.source();

const Chat: React.FC = function Chat() {
  const [query] = useSearchParams();

  const chatId = useMemo(() => query.get('chatId') || uuid(), [query]);

  const { chatList, apiKey, handleChange: handleChatListChange } = useContext<ChatStoreProps>(Store);

  const [value, setValue] = useState<string>('');
  const [isComposing, setIsComposing] = useState<boolean>(false); // 中文输入还在选词的时候敲回车不发请求
  const [loading, setLoading] = useState<boolean>(false);

  const conversation = useMemo<Conversation[]>(() => {
    if (chatId) {
      const cur = chatList.find((chat) => chat.chatId === chatId);
      return cur?.data || [];
    }
    return chatList[0]?.data || [];
  }, [chatId, chatList]);

  const chatIdRef = useRef<string>('');

  const isMobile = useIsMobile();

  const [scrollRef, scrollToBottom] = useScrollToBottom();

  const isMutating = loading && chatId === chatIdRef.current;

  const handleError = (id: string, data: Conversation[]) => {
    const pre = [...data];
    const [lastConversation] = pre.slice(-1);
    const errorResult = { value: lastConversation.value || '', error: true, stop: true };
    Object.assign(lastConversation, errorResult);
    handleChatListChange(id, pre);
  };

  const handleFetchAnswer = async (v: string, retry: boolean = false) => {
    if (!v) return;
    let curConversation = [] as Conversation[];
    if (retry) {
      curConversation = [...conversation];
      const [lastConversation] = curConversation.slice(-1);
      lastConversation.value = '';
      lastConversation.error = false;
      lastConversation.stop = false;
    } else {
      const conversationId = uuid();
      curConversation = [
        ...conversation,
        {
          character: 'user', value: v, key: uuid(), error: false, conversationId
        },
        {
          character: 'bot', value: '', key: uuid(), error: false, conversationId
        }
      ];
    }
    chatIdRef.current = chatId;
    const curChatId = chatIdRef.current;
    handleChatListChange(curChatId, curConversation, true);
    const messages = getCachePrompt([...curConversation], v.trimEnd()); // 获取上下文缓存的信息

    const pre = [...curConversation];
    const [lastConversation] = pre.slice(-1);
    setLoading(true);

    await axios({
      url: API_HOST,
      timeout: 300000,
      method: 'POST',
      responseType: 'stream',
      data: { messages, apiKey },
      cancelToken: source.token,
      onDownloadProgress({ event }) {
        const chunk: string = event.target?.responseText || '';
        try {
          Object.assign(lastConversation, { value: parseMarkdown(chunk), error: false });
          handleChatListChange(curChatId, pre);
        } catch {
          source.cancel('something is wrong');
        }
      },
    }).catch(() => {
      handleError(curChatId, curConversation);
    }).finally(() => {
      setLoading(false);
      Object.assign(lastConversation, { stop: true });
      handleChatListChange(curChatId, pre);
      scrollToBottom();
    });
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    if (isMutating) return;
    const v = value;
    setValue('');
    await handleFetchAnswer(v);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isMutating || isComposing) return;
      setValue('');
      const textArea = e.target as HTMLTextAreaElement;
      const v = textArea?.value?.trim();
      if (v && isMobile) textArea?.blur();
      await handleFetchAnswer(v);
    }
  };

  const handleRetry = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    lastConversation: Conversation,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const { value: lastConversationValue } = lastConversation;
    await handleFetchAnswer(lastConversationValue.trim(), true);
  };

  const renderRetryButton = () => {
    const { length } = conversation;
    if (!length) return null;
    const lastUserConversation = conversation[length - 2];
    const lastConversation = conversation[length - 1];
    if (!lastConversation.stop) return null;

    return (
      <button type="button" className="btn flex justify-center gap-2 btn-neutral" onClick={async (e) => handleRetry(e, lastUserConversation)}>
        <Icon svg={<Refresh />} />
        Regenerate response
      </button>
    );
  };

  return (
    <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full dark:bg-gray-800 relative">
          <div className="h-full w-full overflow-y-auto" ref={scrollRef}>
            {conversation.length > 0 ? <ConversationList data={conversation} /> : <ProjectSourceInfo />}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <form className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
          <div className="relative flex h-full flex-1 flex-col">
            <div className="w-full flex gap-2 justify-center mb-3">
              {renderRetryButton()}
            </div>
            <AutoTextArea
              loading={isMutating}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onButtonClick={handleClick}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
            />
          </div>
        </form>
        <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
          {BOTTOM_TIPS}
        </div>
      </div>
    </main>
  );
};

export default Chat;
