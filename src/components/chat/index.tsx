import React, { useRef, useState, useMemo, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Icon, Toast } from '@douyinfe/semi-ui';
import { useFetchAnswer } from '@/api';
import EmptyChatPlaceholder from '@/components/empty-chat-placeholder';
import { Conversation } from '@/components/conversation/Conversation';
import ConversationList from '@/components/conversation';
import AutoTextArea from '@/components/auto-textarea';
import useIsMobile from '@/hooks/useIsMobile';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import { encode } from '@/utils/encoder/encoder';
import { getSystemMessage, getCachePrompt } from '@/utils';
import { Store } from '@/pages/index';
import Refresh from '@/assets/refresh.svg';
import { ChatStoreProps } from '@/global';

const MAX_TOKENS = parseInt(import.meta.env.VITE_MAX_TOKENS, 10);
const BOTTOM_TIPS = import.meta.env.VITE_DEFAULT_BOTTOM_TIPS;

const Chat: React.FC = () => {
  const [query] = useSearchParams();

  const chatId = useMemo(() => query.get('chatId') || uuid(), [query]);

  const { chatList, handleChange: handleChatListChange } = useContext<ChatStoreProps>(Store);

  const [value, setValue] = useState<string>('');
  const [isComposing, setIsComposing] = useState(false); // 中文输入还在选词的时候敲回车不发请求

  const conversation = useMemo<Conversation[]>(() => {
    if (chatId) {
      const cur = chatList.find(chat => chat.chatId === chatId);
      return cur?.data || [];
    } else {
      return chatList[0]?.data || [];
    }
  }, [chatId, chatList]);

  const chatIdRef = useRef<string>('');

  const isMobile = useIsMobile();

  const scrollRef = useScrollToBottom(conversation);

  const { trigger, isMutating: loading } = useFetchAnswer();

  const isMutating = loading && chatId === chatIdRef.current;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    if (isMutating) return;
    const v = value;
    setValue('');
    await handleFetchAnswer(v);
  };

  const handleError = (id: string, data: Conversation[]) => {
    const pre = [...data];
    const [lastConversation] = pre.slice(-1);
    Object.assign(lastConversation, { value: '请稍后重试', error: true, loading: false });
    handleChatListChange(id, pre);
  };

  const handleFetchAnswer = async (v: string, retry: boolean = false) => {
    if (!v) return;
    if (!Number.isNaN(MAX_TOKENS) && encode(v).length > MAX_TOKENS) {
      setValue(v);
      Toast.warning('提问内容文本过长，请控制在 2000 字以内');
      return;
    }
    let curConversation = [] as Conversation[];
    if (retry) {
      curConversation = [...conversation];
      const [lastConversation] = curConversation.slice(-1);
      lastConversation.loading = true;
      lastConversation.error = false;
    } else {
      const conversationId = uuid();
      curConversation = [
        ...conversation,
        { character: 'user', value: v, key: uuid(), error: false, loading: false, conversationId },
        { character: 'bot', value: '', key: uuid(), error: false, loading: true, conversationId }
      ];
    }
    chatIdRef.current = chatId;
    const curChatId = chatIdRef.current;
    handleChatListChange(curChatId, curConversation, true);
    const systemMessages = getSystemMessage(); // 获取一些前置信息。
    const _messages = getCachePrompt([...curConversation], v.trimEnd()); // 获取上下文缓存的信息
    const messages = systemMessages.concat(_messages);
    const prompt = messages.map(p => p.content).join('');

    await trigger({ messages, tokensLength: encode(prompt).length } as any).then((res: any) => {
      if (curConversation.length === 0) return;
      if (res.status === 200) {
        const { data } = res;
        const error = !Array.isArray(data?.choices) || data?.choices?.[0]?.block;
        const text: string = error ? (data.choices[0]?.message?.content || data.choices[0]?.text || '请稍后重试') : data.choices[0]?.message?.content;
        const type = error ? 'text' : (data?.choices?.[0]?.type || 'text');
        const url = type === 'image' ? data?.choices?.[0]?.url : '';
        const curValue = text.trimStart().replace(/\n{2,}/g, '\n');
        const pre = [...curConversation];
        const [lastConversation] = pre.slice(-1);
        Object.assign(lastConversation, { value: curValue, type, error, loading: false, url });
        handleChatListChange(curChatId, pre);
      } else {
        handleError(curChatId, curConversation);
      }
    }).catch(() => {
      handleError(curChatId, curConversation);
    });
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

  const handleRetry = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, lastConversation: Conversation) => {
    e.stopPropagation();
    e.preventDefault();
    const { value } = lastConversation;
    await handleFetchAnswer(value.trim(), true);
  };

  const renderRetryButton = () => {
    const length = conversation.length;
    if (!length) return null;
    const lastUserConversation = conversation[length - 2];
    const lastConversation = conversation[length - 1];
    if (lastConversation?.loading) return null;
    else {
      return (
        <button className="btn flex justify-center gap-2 btn-neutral" onClick={async (e) => handleRetry(e, lastUserConversation)}>
          <Icon svg={<Refresh />} />Regenerate response
        </button>
      );
    };
  };

  return (
    <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full dark:bg-gray-800 relative">
          <div className="h-full w-full overflow-y-auto" ref={scrollRef}>
            {conversation.length > 0 ? <ConversationList data={conversation} /> : <EmptyChatPlaceholder setValue={setValue} />}
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
