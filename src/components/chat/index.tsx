import React, { useState, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { Icon } from '@douyinfe/semi-ui';
import axios, { AxiosError } from 'axios';
import classNames from 'classnames';
import ProjectSourceInfo from '@/components/project-source-info';
import { Conversation } from '@/components/conversation/ConversationProps';
import useConfigSetting from '@/components/config-setting/useConfigSetting';
import ConversationList from '@/components/conversation';
import AutoTextArea from '@/components/auto-textarea';
import useChatList from '@/hooks/useChatList';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import { getCachePrompt, parseMarkdown, parseStreamText, getSystemMessages } from '@/utils';
import Refresh from '@/assets/svg/refresh.svg';
import Stop from '@/assets/svg/stop.svg';
import { ChatProps } from './Chat';
import styles from './Chat.module.less';

const API_HOST: string = import.meta.env.VITE_API_HOST;
const ONLY_TEXT: string = import.meta.env.VITE_ONLY_TEXT;

const Chat: React.FC<ChatProps> = function Chat(props) {
  const { chat } = props;

  const { data, chatId: ChatID, systemMessage } = chat;

  const { config, handleChange } = useChatList();

  const chatId = useMemo(() => ChatID || uuid(), [ChatID]);

  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<Conversation[]>(data || []);

  const [scrollRef, scrollToBottom] = useScrollToBottom();

  const open = useConfigSetting();

  const abortControllerRef = useRef<AbortController>();

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
    setConversation(curConversation);
    handleChange(chatId, curConversation, true);

    const messages = getSystemMessages(systemMessage).concat(getCachePrompt([...curConversation], v.trimEnd())); // 获取上下文缓存的信息

    abortControllerRef.current = new AbortController();

    setLoading(true);

    const headers = config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {};
    const { apiKey, apiHost, ...body } = config;

    await axios({
      url: apiHost || API_HOST,
      timeout: 300000,
      method: 'POST',
      responseType: 'stream',
      headers: { ...headers },
      data: { messages, ...body },
      signal: abortControllerRef.current.signal,
      onDownloadProgress({ event }) {
        const chunk: string = event.target?.responseText || '';
        const statusCode = event.target?.status;
        if (statusCode === 200) {
          try {
            const parseChunk = ONLY_TEXT === 'true' ? chunk : parseStreamText(chunk);
            setConversation((c) => {
              const pre = [...c];
              const [lastConversation] = pre.slice(-1);
              Object.assign(lastConversation, { value: parseMarkdown(parseChunk), error: false });
              return pre;
            });
            scrollToBottom();
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            // abortControllerRef.current?.abort();
          }
        }
      },
    }).catch((error: AxiosError) => {
      const res = error.response?.data;
      const statusCode = error.response?.status;
      const errorObj = res && typeof res === 'string' ? JSON.parse(res) : res;
      const errorMsg = errorObj?.error?.message || errorObj?.message || '';
      // TODO 这里的state需要重新封装一个组件，更新正在stream中的state
      setConversation((c) => {
        const pre = [...c];
        const [lastConversation] = pre.slice(-1);
        Object.assign(lastConversation, { value: lastConversation.value || errorMsg || 'something is wrong', error: true, stop: true });
        return pre;
      });
      if (statusCode === 401) {
        open(errorMsg); // 没key时弹出弹窗
      }
    }).finally(() => {
      setLoading(false);
      abortControllerRef.current = undefined;
      const pre = [...curConversation];
      const [lastConversation] = pre.slice(-1);
      Object.assign(lastConversation, { stop: true });
      handleChange(chatId, pre);
      scrollToBottom();
    });
  };

  const handleRetry = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, lastConversation: Conversation) => {
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
    if (!lastConversation.stop && !loading) return null;

    return (
      <button
        type="button"
        className="btn flex justify-center gap-2 btn-neutral"
        onClick={async (e) => {
          if (loading) abortControllerRef.current?.abort();
          else { await handleRetry(e, lastUserConversation); }
        }}
      >
        <Icon svg={loading ? <Stop /> : <Refresh />} />
        {`${loading ? 'Stop generating' : 'Regenerate response'}`}
      </button>
    );
  };

  return (
    <div className={classNames('rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.10)]', styles.window)}>
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full relative">
          <div className="h-full w-full overflow-y-auto" ref={scrollRef}>
            {conversation.length > 0 ? <ConversationList data={conversation} /> : <ProjectSourceInfo />}
          </div>
        </div>
      </div>
      <div className="absolute md:px-4 max-md:pb-4 bottom-0 left-0 w-full bg-vert-light-gradient dark:bg-vert-dark-gradient">
        <form className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
          <div className="relative flex h-full flex-1 flex-col">
            <div className="w-full flex gap-2 justify-center mb-3">
              {renderRetryButton()}
            </div>
            <AutoTextArea loading={loading} onFetchAnswer={handleFetchAnswer} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
